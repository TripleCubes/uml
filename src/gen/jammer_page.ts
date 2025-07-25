import { write_file_and_print } from "../share/file.ts";
import { INFINITE, DOCS_FOLDER_PATH } from "../share/consts.ts";
import { get_username } from "../share/utils.ts";

import { type Jammer, type JammerGame } from "./jammer_list.ts";
import { get_max_rank_from_rank_type } from "./utils.ts";
import {
	escape_html_special_chars,
	html_link,
	get_nav,
	get_boxes,
	get_games_table,
} from "./html.ts";
import {
	GRAPH_EXPLAINS_LINK,
	WEBSITE_URL,
	SMALL_EMBED_IMG_SUB_URL,
	ICON_PATH,
} from "./links.ts";
import { get_ilscore } from "./ilscore.ts";

function verify_username_or_crash(username: string): void {
	for (let i = 0; i < username.length; i++) {
		let c = username[i];

		if (c >= "0" && c <= "9") {
			continue;
		}

		if (c >= "a" && c <= "z") {
			continue;
		}

		if (c >= "A" && c <= "Z") {
			continue;
		}

		if (c == "_" || c == "-") {
			continue;
		}

		console.log("username verify failed:", username);
		Deno.exit();
	}
}

function jammer_have_game_in_top(jammer: Jammer, top: number): boolean {
	for (let game of jammer.game_list) {
		if (game.rank <= top) {
			return true;
		}
	}

	return false;
}

function get_rank_by(
	jammer: Jammer,
	ordering_list_list: Array< [string, Array<number>] >
): string {
	let html = '';

	for (let [s, arr] of ordering_list_list) {
		let latest_ordering = arr[arr.length - 1];

		if (s == '1' || s == '5' || s == '10' || s == '20') {
			if (!jammer_have_game_in_top(jammer, Number(s))) {
				continue;
			}

			html += '\t\t<h3>Rank by games in top ' + s + '</h3>\n'
			      + '\t\t<span class="dot_' + s + '"></span>\n'
			      + '\t\t<p>Rank: ' + (latest_ordering+1).toString() + '</p>\n'
                  + get_boxes(jammer, Number(s))
			      + '\n';
		}
		else if (s == 'ilscore') {
			let total_ilscore = 0;
			for (let game of jammer.game_list) {
				total_ilscore += get_ilscore(
					game.game.score,
					game.num_games_in_jam
				);
			}
			html += '\t\t<h3>Rank by ilScore</h3>\n'
			      + '\t\t<span class="dot_ilscore"></span>\n'
			      + '\t\t<p>Rank: ' + (latest_ordering+1).toString() + '</p>\n'
			      + '\t\t<p>Total ilScore: '
			              + Math.round(total_ilscore).toString() + '</p>\n'
			      + '\n';
		}
		else {
			console.log('rank type unhanded:', s);
			Deno.exit();
		}
	}

	return html;
}

function get_game_list(jammer: Jammer): string {
	let html
	= '\t\t<h3 id="games_header">' + jammer.game_list.length.toString()
	                   + (jammer.game_list.length == 1 ? ' Game' : ' Games')
	                   + '</h3>\n'
	+ '\t\t<button id="sort_btn">Sorting by jam</button>\n'
	+ get_games_table(jammer, INFINITE, (a, b) => 0, true);

	return html;
}

function get_earliest_game_ordering_from_max_rank(
	jammer: Jammer, max_rank: number
): number {
	let earliest = INFINITE;

	for (let i = 0; i < jammer.game_list.length; i++) {
		let game = jammer.game_list[i];

		if (game.rank > max_rank) {
			continue;
		}

		if (earliest > game.ordering_both) {
			earliest = game.ordering_both;
		}
	}

	return earliest;
}

function get_ordering_list_list_data_in_js(
	jammer: Jammer,
	ordering_list_list: Array< [string, Array<number>] >
): string {
	let s = '\t<script>\n'
	      +     '\t\tlet ORDERING_LIST_LIST = [\n';
	
	let num_of_num_per_line = 40;
	for (let [rank_type, arr] of ordering_list_list) {
		s += '\t\t\t[ "' + rank_type + '", [\n';

		let max_rank = get_max_rank_from_rank_type(rank_type);
		let earliest_game_ordering
			= get_earliest_game_ordering_from_max_rank(jammer, max_rank);
		let arr_filtered = arr.filter((v, i) => i >= earliest_game_ordering);

		for (let [i, rank_ordering] of arr_filtered.entries()) {
			if (i % num_of_num_per_line == 0) {
				s += '\t\t\t\t';
			}

			s += rank_ordering.toString() + ',';

			if (
				i % num_of_num_per_line == num_of_num_per_line - 1
				|| i == arr_filtered.length - 1
			) {
				s += '\n';
			}
			else {
				s += ' ';
			}
		}

		s += '\t\t\t]],\n';
	}

	s +=     '\t\t];\n'
	   + '\t</script>\n';

	return s;
}

function get_graph_explains(): string {
	return '\t\t<div id="graph_explains">\n'
	     +     '\t\t\t' + html_link(
	                            GRAPH_EXPLAINS_LINK,
	                            "this graph doesn't show accurate history"
	                      ) + '\n'
	     + '\t\t</div>\n';
}

function get_file_name(jammer: Jammer): string {
	return get_username(jammer.author.link) + ".html";
}

function get_embed_desc(
	jammer: Jammer, ordering_list_list: Array< [string, Array<number>] >
): string {
	let embed_str = "";

	for (let [rank_type, arr] of ordering_list_list) {
		let rank = arr[arr.length - 1] + 1;

		if (
			   rank_type == '1'
			|| rank_type == '5'
			|| rank_type == '10'
			|| rank_type == '20'
		) {
			if (!jammer_have_game_in_top(jammer, Number(rank_type))) {
				continue;
			}
			embed_str += 'Rank by game in top ' + rank_type + ': '
			           + rank.toString() + '&#10;';
		}
		else if (rank_type == 'ilscore') {
			embed_str += 'Rank by ilScore: ' + rank.toString() + '&#10;';
		}
		else {
			console.log('rank type unhandled:', rank_type);
			Deno.exit();
		}
	}

	embed_str += '&#10;'
	           + jammer.game_list.length.toString()
	           + ' games&#10;';

	for (let [i, game] of jammer.game_list.toReversed().entries()) {
		if (i >= 5) {
			embed_str += '...&#10;';
			break;
		}

		embed_str += '&bull; ' + escape_html_special_chars(game.game.name)
		           + ' | ' + (game.is_majorjam ? 'MJ+' : 'MJ') + ' '
		           + game.mj_id + ': ' + game.jam_name
		           + ' | rank: ' + game.rank.toString()
		           + ' | ilscore: '
		           + Math.round(get_ilscore(
		                 game.game.score, game.num_games_in_jam
		             ))
		           + '&#10;';
	}

	return '\t<meta content="' + embed_str + '" property="og:description">\n';
}

function get_html(
	jammer: Jammer,
	ordering_list_list: Array< [string, Array<number>] >,
	nav_jam_list_path: string
): string {
	let html = '';

	html += '<!DOCTYPE html>\n'
	      + '<html>\n'
	      + '<head>\n'
	      +     '\t<meta charset="UTF-8">\n'
	      +     '\t<meta name="viewport" content="width=device-width, '
	                                          + 'initial-scale=1.0">\n'
	      +     '\n'
	      +     '\t<link rel="icon" href="' + ICON_PATH + '">\n'
	      +     '\t<title>' + escape_html_special_chars(jammer.author.name)
	                        + '&#39;s jammer page</title>\n'
	      +     '\t<meta content="Unofficial Mini Jam Leaderboard" '
	                        + 'property="og:site_name">\n'
	      +     '\t<meta content="'
	                        + escape_html_special_chars(jammer.author.name)
	                        + '&#39;s jammer page'
	                        + '" property="og:title">\n'
	      +     '\t<meta content="' + WEBSITE_URL
	                                + 'jammer/' + get_file_name(jammer)
	                                + '" property="og:url">\n'
	      +     get_embed_desc(jammer, ordering_list_list)
	      +     '\t<meta content="' + WEBSITE_URL + SMALL_EMBED_IMG_SUB_URL
	                                + '" property="og:image">\n'
	      +     '\t<meta content="#ffa4a4" name="theme-color">\n'
	      +     '\n'
	      +     '\t<link rel="stylesheet" href="../css/share.css">\n'
	      +     '\t<link rel="stylesheet" href="../css/jammer_page.css">\n'
	      + '</head>\n'
	      + '<body>\n'
	      +     '\t<div id="content">\n'
	      +         get_nav(nav_jam_list_path)
	      +         '\n'
	      +         '\t\t<h1>' + escape_html_special_chars(jammer.author.name)
	                           + '</h1>\n'
	      +         '\t\t' + html_link(
	                    jammer.author.link,
	                    jammer.author.link.replaceAll('https://', ''),
	                ) + '\n'
	      +         '\n'
	      +         '\t\t<div id="graph"></div>\n'
	      +         get_graph_explains()
	      +         '\n'
	      +         get_rank_by(jammer, ordering_list_list)
	      +         get_game_list(jammer)
	      +     '\t</div>\n'
	      +     get_ordering_list_list_data_in_js(jammer, ordering_list_list)
	      +     '\t<script src="../js/jammer_page/jam_info.js"></script>\n'
	      +     '\t<script src="../js/jammer_page/rank_graph.js"></script>\n'
	      +     '\t<script src="../js/jammer_page/sort_btn.js"></script>\n'
	      + '</body>\n'
	      + '</html>\n';

	return html;
}

export function write_jammer_page(
	jammer: Jammer,
	sorted_jammer_list_list_list: Array< [string, Array<Jammer[]>] >,
	nav_jam_list_path: string
): void {
	verify_username_or_crash(get_username(jammer.author.link));

	let ordering_list_list: Array< [string, Array<number>] >
		= sorted_jammer_list_list_list.map(
			([s, arr]) => [s, arr.map(
				jammer_list => {
					let index = jammer_list.findIndex(
						v => v.author.link == jammer.author.link
					);

					if (index == -1) {
						console.log(
							"can not find the jammer. this error should not "
							+ "be able to happen"
						);
						Deno.exit();
					}
					else {
						return index;
					}
				}
			)]
		);

	let html = get_html(jammer, ordering_list_list, nav_jam_list_path);
	write_file_and_print(
		DOCS_FOLDER_PATH + "jammer/" + get_file_name(jammer), html
	);
}

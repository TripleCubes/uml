import {
	DOCS_FOLDER_PATH, JAM_LIST_PAGE_SPLIT_SIZE, INFINITE, RANK_STR_INF
} from "../share/consts.ts";
import { write_file_and_print } from "../share/file.ts";
import { type Jam, type Game } from "../share/types.ts";
import { get_username, get_random_emoji } from "../share/utils.ts";

import {
	get_nav,
	html_link,
	escape_html_special_chars,
} from "./html.ts";
import { ms_to_str } from "./time.ts";
import { ILSCORE_HINT, get_ilscore } from "./ilscore.ts";
import { WEBSITE_URL, SMALL_EMBED_IMG_SUB_URL, ICON_PATH } from "./links.ts";

function split(list: Array<[Jam, number]>)
: Array<Array<[Jam, number]>> {
	let result_list: Array<Array<[Jam, number]>> = [];

	for (let i = 0; i < list.length; i++) {
		let [jam, num_new_jammers] = list[i];

		if (
			result_list.length < Math.floor(
				(jam.mj_id - 1) / JAM_LIST_PAGE_SPLIT_SIZE
			) + 1
		) {
			result_list.push([]);
		}

		result_list[result_list.length - 1].push([jam, num_new_jammers]);
	}

	return result_list;
}

function get_num_jammers(jam: Jam): number {
	let jammer_link_list: string[] = [];

	for (let game of jam.game_list) {
	for (let author of game.author_list) {
		let found = jammer_link_list.find(v => v == author.link);

		if (found == undefined) {
			jammer_link_list.push(author.link);
		}
	}
	}

	return jammer_link_list.length;
}

function get_game_list_with_rank(jam: Jam): Array<[Game, number]> {
	let game_list_with_rank: Array<[Game, number]> = [];

	let current_rank = 0;
	for (let i = 0; i < jam.game_list.length; i++) {
		let game = jam.game_list[i];

		let prev_game: Game = {
			name: "",
			link: "",
			id: 0,
			num_ratings: 0,
			score: 0,
			submitted_at: 0,
			author_list: [],
		};
		if (i - 1 >= 0) {
			prev_game = jam.game_list[i - 1];
		}

		let rank = 0;
		if (game.score == prev_game.score) {
			rank = current_rank;
		}
		else {
			rank = i + 1;
			current_rank = i + 1;
		}

		if (game.score == 0) {
			rank = INFINITE;
		}

		game_list_with_rank.push([game, rank]);
	}

	return game_list_with_rank;
}

function get_time(jam: Jam, game: Game): string {
	let diff = game.submitted_at - jam.jam_end_at;
	let time_class = diff > 0 ? "late" : "early";

	return '\t\t\t\t<td><span class="'
	       + time_class + '">'
	       + ms_to_str(Math.abs(diff))
	       + time_class
	       + '</span></td>\n';
}

function get_authors(game: Game): string {
	let html = '\t\t\t\t<td>\n';

	for (let i = 0; i < game.author_list.length; i++) {
		let author = game.author_list[i];

		html += '\t\t\t\t\t' + html_link(
		    '../jammer/' + get_username(author.link) + '.html',
		    escape_html_special_chars(author.name)
		);
		
		if (i != game.author_list.length - 1) {
			html += ',';
		}

		html += '\n';
	}

	html += '\t\t\t\t</td>\n';
	return html;
}

function get_table_content(jam: Jam): string {
	let game_list_with_rank = get_game_list_with_rank(jam);
	let html = '';

	for (let i = 0; i < Math.min(game_list_with_rank.length, 20); i++) {
		let [game, rank] = game_list_with_rank[i];

		let rank_str = rank.toString();
		if (rank == INFINITE) {
			if (!jam.is_majorjam && jam.mj_id == 13) {
				rank_str = get_random_emoji();
			}
			else {
				rank_str = RANK_STR_INF;
			}
		}

		let ilscore_str = Math.round(get_ilscore(
			game.score,
			jam.game_list.length
		)).toString();
		if (!jam.is_majorjam && jam.mj_id == 13) {
			ilscore_str = get_random_emoji();
		}

		html
		+= '\t\t\t<tr>\n'
		 +     '\t\t\t\t<td>' + rank_str + '</td>\n'
		 +     '\t\t\t\t<td>' + html_link(
		                            game.link,
		                            escape_html_special_chars(game.name)
		                        ) + '</td>\n'
		 +     get_time(jam, game)
		 +     get_authors(game)
		 +     '\t\t\t\t<td>' + game.num_ratings + '</td>\n'
		 +     '\t\t\t\t<td>' + ilscore_str + '</td>\n'
		 + '\t\t\t</tr>\n';
	}

	return html;
}

function get_jam_tables(list: Array<[Jam, number]>): string {
	let html = '';

	for (let i = list.length - 1; i >= 0; i--) {
		let [jam, num_new_jammers] = list[i];

		html
		+= '\t\t<h3>' + html_link(
		                    jam.link,
		                    (jam.is_majorjam ? "Major Jam " : "Mini Jam ")
		                        + jam.mj_id.toString() + ": " + jam.name
		                ) + '</h3>\n'
		 + '\t\t<span>' + jam.game_list.length.toString() + '</span>\n'
		 + '\t\t<span>' + get_num_jammers(jam).toString() + '</span>\n'
		 + '\t\t<span' + (jam.is_majorjam? ' class="num_new_majorjammers"' : '')
		               + '>' + num_new_jammers.toString() + '</span>\n'
		 + '\t\t<table>\n'
		 + '\t\t<thead>\n'
		 +     '\t\t\t<tr>\n'
		 +         '\t\t\t\t<td title="Rank">Rk</td>\n'
		 +         '\t\t\t\t<td>Title</td>\n'
		 +         '\t\t\t\t<td>Time</td>\n'
		 +         '\t\t\t\t<td>By</td>\n'
		 +         '\t\t\t\t<td title="Number of ratings">Rt</td>\n'
		 +         '\t\t\t\t<td title="' + ILSCORE_HINT + '">ilScr</td>\n'
		 +     '\t\t\t</tr>\n'
		 + '\t\t</thead>\n'
		 + '\t\t<tbody>\n'
		 +     get_table_content(jam)
		 + '\t\t</tbody>\n'
		 + '\t\t</table>\n'
		 + '\n';
	}

	return html;
}

function get_minijam_majorjam_switcher(
	is_majorjam: boolean,
	majorjam_largest_page_num: number,
	minijam_largest_page_num: number
): string {
	let minijam_path = '../minijam/' + minijam_largest_page_num
	                                  .toString().padStart(6, "0") + '.html';
	let majorjam_path = '../majorjam/' + majorjam_largest_page_num
	                                    .toString().padStart(6, "0") + '.html';
	
	return '\t\t<div id="minijam_majorjam">'
	     + '<a ' + (is_majorjam ? '' : 'class="link_highlight" ')
	             + 'href="' + minijam_path + '">Mini Jam</a>'
	     + '<a ' + (is_majorjam ? 'class="link_highlight" ' : '')
	             + 'href="' + majorjam_path + '">Major Jam</a>'
	     + '</div>\n';
}

function get_page_links(
	page_notmultiplied: number,
	largest_page_num: number,
): string {
	let html = '\t\t<div class="page_links">\n';

	for (let i = largest_page_num; i >= 1; i -= JAM_LIST_PAGE_SPLIT_SIZE) {
		let path = i.toString().padStart(6, "0") + '.html';

		html += '\t\t\t<a '
		      + (
		            page_notmultiplied * JAM_LIST_PAGE_SPLIT_SIZE + 1 == i
		                ? 'class="link_highlight" ' : ''
		        )
		      + 'href="' + path + '">'
		      + i.toString()
		      + '</a>\n';
	}

	html += '\t\t</div>\n';
	return html;
}

function get_embed_desc(list: Array<[Jam, number]>): string {
	let embed_str = "";

	for (let [jam, num_new_jammers] of list.toReversed()) {
		embed_str += (jam.is_majorjam ? "Major Jam" : "Mini Jam")
		           + ' ' + jam.mj_id.toString()
		           + ': ' + jam.name + '&#10;';

		for (let [i, [game, rank]] of get_game_list_with_rank(jam).entries()) {
			if (i >= 5) {
				embed_str += '...&#10;';
				break;
			}

			embed_str += rank.toString() + '. '
			           + escape_html_special_chars(game.name) + '&#10;';
		}

		embed_str += '&#10;';
	}

	return '\t<meta content="' + embed_str + '" property="og:description">\n';
}

function write(
	list: Array<[Jam, number]>,
	page_notmultiplied: number,
	majorjam_largest_page_num: number,
	minijam_largest_page_num: number,
	is_majorjam: boolean,
	nav_jam_list_path: string
): void {
	let title = (is_majorjam ? "Major Jams" : "Mini Jams")
	          + " from " + list[0][0].mj_id.toString()
	          + " to " + list[list.length - 1][0].mj_id.toString();

	let page_links = get_page_links(
		page_notmultiplied,
		is_majorjam ? majorjam_largest_page_num : minijam_largest_page_num
	);

	let sub_path = (is_majorjam ? "majorjam/" : "minijam/")
	             + (page_notmultiplied * JAM_LIST_PAGE_SPLIT_SIZE + 1)
	                   .toString()
	                   .padStart(6, "0")
	             + ".html";

	let html
	= '<!DOCTYPE html>\n'
	+ '<html>\n'
	+ '<head>\n'
	+     '\t<meta charset="UTF-8">\n'
	+     '\t<meta name="viewport" '
	          + 'content="width=device-width, initial-scale=1.0">\n'
	+     '\n'
	+     '\t<link rel="icon" href="' + ICON_PATH + '">\n'
	+     '\t<title>' + title + '</title>\n'
	+     '\t<meta content="Unofficial Mini Jam Leaderboard" '
	                          + 'property="og:site_name">\n'
	+     '\t<meta content="' + title + '" property="og:title">\n'
	+     '\t<meta content="' + WEBSITE_URL
	                          + sub_path
	                          + '" property="og:url">\n'
	+     get_embed_desc(list)
	+     '\t<meta content="' + WEBSITE_URL + SMALL_EMBED_IMG_SUB_URL
	                          + '" property="og:image">\n'
	+     '\t<meta content="#ffa4a4" name="theme-color">\n'
	+     '\n'
	+     '\t<link rel="stylesheet" href="../css/share.css">\n'
	+     '\t<link rel="stylesheet" href="../css/jam_list.css">\n'
	+ '</head>\n'
	+ '<body>\n'
	+     '\t<div id="content">\n'
	+         get_nav(nav_jam_list_path)
	+         '\t\t<h1>' + title + '</h1>\n'
	+         '\n'
	+         get_minijam_majorjam_switcher(
	              is_majorjam,
	              majorjam_largest_page_num,
	              minijam_largest_page_num
	          )
	+         page_links
	+         '\n'
	+         get_jam_tables(list)
	+         page_links
	+     '\t</div>\n'
	+ '</body>\n'
	+ '</html>\n';

	write_file_and_print(DOCS_FOLDER_PATH + sub_path, html);
}

function to_jam_and_num_new_jammers_list(jam_list: Jam[])
: Array<[Jam, number]> {
	let tup_list: Array<[Jam, number]> = [];

	let jammer_link_list: string[] = [];

	for (let jam of jam_list) {
		let prev_jammer_link_list_length = jammer_link_list.length;

		for (let game of jam.game_list) {
		for (let author of game.author_list) {
			let found = jammer_link_list.find(v => v == author.link);

			if (found == undefined) {
				jammer_link_list.push(author.link);
			}
		}
		}

		let diff = jammer_link_list.length - prev_jammer_link_list_length;
		tup_list.push([jam, diff]);
	}

	return tup_list;
}

export function write_jam_list_pages(
	jam_list: Jam[], nav_jam_list_path: string
): void {
	let majorjam_list = jam_list.filter( v => v.is_majorjam );
	let minijam_list = jam_list.filter( v => !v.is_majorjam );

	let majorjam_tup_list = to_jam_and_num_new_jammers_list(majorjam_list);
	let minijam_tup_list = to_jam_and_num_new_jammers_list(minijam_list);

	let majorjam_list_list = split(majorjam_tup_list);
	let minijam_list_list = split(minijam_tup_list);

	let majorjam_largest_page_num
		= (majorjam_list_list.length - 1) * JAM_LIST_PAGE_SPLIT_SIZE + 1;
	let minijam_largest_page_num
		= (minijam_list_list.length - 1) * JAM_LIST_PAGE_SPLIT_SIZE + 1;

	majorjam_list_list.forEach(
		(v, i) => write(
			v,
			i,
			majorjam_largest_page_num,
			minijam_largest_page_num,
			true,
			nav_jam_list_path
		)
	);
	minijam_list_list.forEach(
		(v, i) => write(
			v,
			i,
			majorjam_largest_page_num,
			minijam_largest_page_num,
			false,
			nav_jam_list_path
		)
	);
}

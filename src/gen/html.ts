import { get_username, get_random_emoji } from "../share/utils.ts";
import {
	DEFAULT_LEADERBOARD_PATH, INFINITE, RANK_STR_INF
} from "../share/consts.ts";

import { SOURCE_CODE_LINK } from "./links.ts";

import { type Jammer, type JammerGame } from "./jammer_list.ts";
import { ILSCORE_HINT, get_ilscore } from "./ilscore.ts";
import { ms_to_str } from "./time.ts";

export function escape_html_special_chars(s: string): string {
	return s.replaceAll("&", "&amp;")
	        .replaceAll("<", "&lt;")
	        .replaceAll(">", "&gt;")
	        .replaceAll('"', "&quot;")
	        .replaceAll("'", "&#39;");
}

export function html_link(link: string, text: string): string {
	return '<a href="' + link + '">' + text + '</a>';
}

export function get_nav(jam_list_path: string): string {
	return '\t\t<div id="nav">\n'
	+     '\t\t\t' + html_link(DEFAULT_LEADERBOARD_PATH, 'Leaderboard') + '\n'
	+     '\t\t\t' + html_link(jam_list_path, 'Jam list') + '\n'
	+     '\t\t\t' + html_link('../search/search.html', 'Jammer search') + '\n'
	+     '\t\t\t' + html_link('../stats/stats.html', 'Stats') + '\n'
	+     '\t\t\t' + html_link(SOURCE_CODE_LINK, 'Source code') + '\n'
	+ '\t\t</div>\n';
}

export function get_boxes(jammer: Jammer, max_rank: number): string {
	let html = '\t\t<div class="boxes">\n';

	let count = 0;
	let game_list_sorted = jammer.game_list.toSorted(
		(a, b) => a.rank - b.rank
	);
	for (let game of game_list_sorted) {
		if (game.rank > max_rank) {
			break;
		}
		count++;
		html += '\t\t\t<span'
		      + (game.is_majorjam? ' class="box_majorjam"' : '') + '>'
		      + game.rank.toString()
		      + '</span>\n';
	}

	html += '\t\t\t<span>' + count.toString() + '</span>\n'
	      + '\t\t</div>\n';
	return html;
}

function get_game_time_info(game: JammerGame): string {
	let diff = game.game.submitted_at - game.jam_end_at;
	let time_class = diff > 0 ? "late" : "early";
	return '\t\t\t\t<td><span class="' + time_class + '">'
	     + ms_to_str(Math.abs(diff)) + time_class + '</span></td>\n';
}

function get_teamed_with(jammer: Jammer, game: JammerGame): string {
	let html = '\t\t\t\t<td>\n';

	let author_list_filtered
		= game.game.author_list.filter(v => v.link != jammer.author.link);

	if (author_list_filtered.length == 0) {
		return '\t\t\t\t<td></td>\n';
	}

	for (let i = 0; i < author_list_filtered.length; i++) {
		let author = author_list_filtered[i];

		html += '\t\t\t\t\t' + html_link(
			'../jammer/' + get_username(author.link) + '.html',
			escape_html_special_chars(author.name)
		);

		if (i != author_list_filtered.length - 1) {
			html += ',';
		}

		html += '\n';
	}

	html += '\t\t\t\t</td>\n';
	return html;
}

export function get_games_table(
	jammer: Jammer,
	max_rank: number,
	sort_func: (a: JammerGame, b: JammerGame) => number,
	reverse: boolean
): string {
	let html
	= '\t\t<table id="games_table">\n'
	+ '\t\t<thead>\n'
	+     '\t\t\t<tr>\n'
	+         '\t\t\t\t<td>Title</td>\n'
	+         '\t\t\t\t<td>Time</td>\n'
	+         '\t\t\t\t<td>Teamed with</td>\n'
	+         '\t\t\t\t<td title="MJ+: Major Jam">Jam</td>\n'
	+         '\t\t\t\t<td title="Number of games in jam">Vs</td>\n'
	+         '\t\t\t\t<td title="Rank">Rk</td>\n'
	+         '\t\t\t\t<td title="Number of ratings">Rt</td>\n'
	+         '\t\t\t\t<td title="' + ILSCORE_HINT + '">ilScr</td>\n'
	+     '\t\t\t</tr>\n'
	+ '\t\t</thead>\n'
	+ '\t\t<tbody>\n';

	let game_list_sorted = jammer.game_list.toSorted(sort_func);
	if (reverse) {
		game_list_sorted.reverse();
	}

	for (let game of game_list_sorted) {
		if (game.rank > max_rank) {
			continue;
		}

		let rank_str = game.rank.toString();
		if (game.rank == INFINITE) {
			if (!game.is_majorjam && game.mj_id == 13) {
				rank_str = get_random_emoji();
			}
			else {
				rank_str = RANK_STR_INF;
			}
		}

		let ilscore_str = Math.round(get_ilscore(
			game.game.score,
			game.num_games_in_jam
		)).toString();
		if (!game.is_majorjam && game.mj_id == 13) {
			ilscore_str = get_random_emoji();
		}

		html
		+= '\t\t\t<tr' + (game.is_majorjam? ' class="tr_majorjam"' : '') + '>\n'
		 +     '\t\t\t\t<td>' + html_link(
		                            game.game.link,
		                            escape_html_special_chars(game.game.name)
		                        )
		                      + '</td>\n'
		 +     get_game_time_info(game)
		 +     get_teamed_with(jammer, game)
		 +     '\t\t\t\t<td>' + html_link(
		                            game.jam_link,
		                            (game.is_majorjam ? 'MJ+ ' : 'MJ ')
		                                + game.mj_id.toString() + ': '
		                                + game.jam_name
		                        )
		                      + '</td>\n'
		 +     '\t\t\t\t<td>' + game.num_games_in_jam.toString() + '</td>\n'
		 +     '\t\t\t\t<td>' + rank_str + '</td>\n'
		 +     '\t\t\t\t<td>' + game.game.num_ratings.toString() + '</td>\n'
		 +     '\t\t\t\t<td>' + ilscore_str + '</td>\n'
		 + '\t\t\t</tr>\n';
	}

	html += '\t\t</tbody>\n'
	     + '\t\t</table>\n';

	return html;
}

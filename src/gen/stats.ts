import { type Jam } from "../share/types.ts";
import { write_file_and_print } from "../share/file.ts";
import { DOCS_FOLDER_PATH, INFINITE } from "../share/consts.ts";

import { type Jammer } from "./jammer_list.ts";
import { get_nav } from "./html.ts";
import { WEBSITE_URL, ICON_PATH, SMALL_EMBED_IMG_SUB_URL } from "./links.ts";

function get_jammer_count(jam_list: Jam[], is_majorjam: boolean): number {
	let author_link_list: string[] = [];

	for (let jam of jam_list) {
		if (jam.is_majorjam != is_majorjam) {
			continue;
		}

		for (let game of jam.game_list) {
		for (let author of game.author_list) {
			let found = author_link_list.find(v => v == author.link);

			if (found == undefined) {
				author_link_list.push(author.link);
			}
		}
		}
	}

	return author_link_list.length;
}

function get_avg_top_1_scores(
	jam_list: Jam[], is_majorjam: boolean, range: number
): string {
	let filtered = jam_list.filter(v => v.is_majorjam == is_majorjam);
	return '\t\t\t<p>avg top 1 scores: '
	     + (
	           filtered.slice(-range)
	                   .reduce((acc, v) => acc + v.game_list[0].score, 0)
	               / Math.min(range, filtered.length)
	       )
	      .toFixed(4)
	     + '</p>\n';
}

function get_highest_top_1_score(
	jam_list: Jam[], is_majorjam: boolean, range: number
): string {
	return '\t\t\t<p>highest top 1 score: '
	     + jam_list.filter(v => v.is_majorjam == is_majorjam)
	               .slice(-range)
	               .reduce(
	                    (acc, v) => acc < v.game_list[0].score
	                              ? v.game_list[0].score : acc,
	                    0
	                ).toString()
	     + '</p>\n';
}

function get_lowest_top_1_score(
	jam_list: Jam[], is_majorjam: boolean, range: number
): string {
	return '\t\t\t<p>lowest top 1 score: '
	     + jam_list.filter(v => v.is_majorjam == is_majorjam)
	               .slice(-range)
	               .reduce(
	                    (acc, v) => acc > v.game_list[0].score
	                              ? v.game_list[0].score : acc,
	                    INFINITE
	                ).toString()
	     + '</p>\n';
}

export function write_stats_page(
	jammer_list: Jammer[], jam_list: Jam[], nav_jam_list_path: string
): void {
	let sub_path = "stats/stats.html";

	let num_jammers = jammer_list.length;
	let num_minijammers = get_jammer_count(jam_list, false);
	let num_majorjammers = get_jammer_count(jam_list, true);

	let num_minijams = jam_list.filter(v => !v.is_majorjam).length;
	let num_minijam_games = jam_list.filter(v => !v.is_majorjam)
	                       .reduce((acc, v) => acc + v.game_list.length, 0);

	let num_majorjams = jam_list.filter(v => v.is_majorjam).length;
	let num_majorjam_games = jam_list.filter(v => v.is_majorjam)
	                        .reduce((acc, v) => acc + v.game_list.length, 0);

	let html
	= '<!DOCTYPE html>\n'
	+ '<html>\n'
	+ '<head>\n'
	+     '\t<meta charset="UTF-8">\n'
	+     '\t<meta name="viewport" '
	          + 'content="width=device-width, initial-scale=1.0">\n'
	+     '\n'
	+     '\t<link rel="icon" href="' + ICON_PATH + '">\n'
	+     '\t<title>Stats</title>\n'
	+     '\t<meta content="Unofficial Mini Jam Leaderboard" '
	                          + 'property="og:site_name">\n'
	+     '\t<meta content="Stats" property="og:title">\n'
	+     '\t<meta content="' + WEBSITE_URL + sub_path
	                          + '" property="og:url">\n'
	+     '\t<meta content="' + 'Num of jammers:&#10;'
	                          + num_jammers.toString() + ' jammers&#10;'
	                          + num_minijammers.toString() + ' minijammers&#10;'
	                          + num_majorjammers.toString()+' majorjammers&#10;'
	                          + '&#10;'
	                          + 'Mini Jam:&#10;'
	                          + num_minijams.toString() + ' Mini Jams&#10;'
	                          + num_minijam_games.toString() + ' games&#10;'
	                          + '&#10;'
	                          + 'Major Jam:&#10;'
	                          + num_majorjams.toString() + ' Major Jams&#10;'
	                          + num_majorjam_games.toString() + ' games&#10;'
	                          + '" property="og:description">\n'
	+     '\t<meta content="' + WEBSITE_URL + SMALL_EMBED_IMG_SUB_URL
	                          + '" property="og:image">\n'
	+     '\t<meta content="#ffa4a4" name="theme-color">\n'
	+     '\n'
	+     '\t<link rel="stylesheet" href="../css/share.css">\n'
	+     '\t<link rel="stylesheet" href="../css/stats.css">\n'
	+ '</head>\n'
	+ '<body>\n'
	+     '\t<div id="content">\n'
	+         get_nav(nav_jam_list_path)
	+         '\t\t<h1>Stats</h1>\n'
	+         '\n'
	+         '\t\t<div id="left_side">\n'
	+             '\t\t\t<h3>Number of jammers</h3>\n'
	+             '\t\t\t<p>' + num_jammers.toString() + ' jammers</p>\n'
	+             '\t\t\t<p>' + num_minijammers.toString()
	                          + ' minijammers</p>\n'
	+             '\t\t\t<p>' + num_majorjammers.toString()
	                          + ' majorjammers</p>\n'
	+             '\n'
	+             '\t\t\t<h3>Mini Jam</h3>\n'
	+             '\t\t\t<p>' + num_minijams.toString() + ' Mini Jams</p>\n'
	+             '\t\t\t<p>' + num_minijam_games.toString() + ' games</p>\n'
	+             '\n'
	+             '\t\t\t<h3>Major Jam</h3>\n'
	+             '\t\t\t<p>' + num_majorjams.toString() + ' Major Jams</p>\n'
	+             '\t\t\t<p>' + num_majorjam_games.toString() + ' games</p>\n'
	+         '\t\t</div>\n'
	+         '\t\t<div id="right_side">\n'
	+             '\t\t\t<h3>Last 20 Mini Jams</h3>\n'
	+             get_avg_top_1_scores(jam_list, false, 20)
	+             get_highest_top_1_score(jam_list, false, 20)
	+             get_lowest_top_1_score(jam_list, false, 20)
	+             '\n'
	+             '\t\t\t<h3>Last 50 Mini Jams</h3>\n'
	+             get_avg_top_1_scores(jam_list, false, 50)
	+             get_highest_top_1_score(jam_list, false, 50)
	+             get_lowest_top_1_score(jam_list, false, 50)
	+             '\n'
	+             '\t\t\t<h3>Last 100 Mini Jams</h3>\n'
	+             get_avg_top_1_scores(jam_list, false, 100)
	+             get_highest_top_1_score(jam_list, false, 100)
	+             get_lowest_top_1_score(jam_list, false, 100)
	+             '\n'
	+             '\t\t\t<h3>Last 20 Major Jams</h3>\n'
	+             get_avg_top_1_scores(jam_list, true, 20)
	+             get_highest_top_1_score(jam_list, true, 20)
	+             get_lowest_top_1_score(jam_list, true, 20)
	+         '\t\t</div>\n'
	+     '\t</div>\n'
	+ '</body>\n'
	+ '</html>\n';

	write_file_and_print(DOCS_FOLDER_PATH + "stats/stats.html", html);
}

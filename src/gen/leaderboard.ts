import { write_file_and_print } from "../share/file.ts";
import { DOCS_FOLDER_PATH } from "../share/consts.ts";
import { get_username } from "../share/utils.ts";

import { type Jammer, type JammerGame } from "./jammer_list.ts";
import { get_nav } from "./html.ts";
import {
	escape_html_special_chars, html_link, get_boxes, get_games_table
} from "./html.ts";
import { get_ilscore } from "./ilscore.ts";
import { get_max_rank_from_rank_type } from "./utils.ts";
import { WEBSITE_URL, LARGE_EMBED_IMG_SUB_URL, ICON_PATH } from "./links.ts";

function get_jammer_list(
	page: Jammer[], page_num: number, page_size: number, rank_type: string
): string {
	let html = '';

	for (let i = 0; i < page.length; i++) {
		let jammer = page[i];

		let boxes_html = '';
		let total_ilscore_html = '';
		let sort_func: (a: JammerGame, b: JammerGame) => number;
		if (
			   rank_type == '1'
			|| rank_type == '5'
			|| rank_type == '10'
			|| rank_type == '20'
		) {
			boxes_html = get_boxes(jammer, Number(rank_type));
			sort_func = (a, b) => {
				if (a.rank == b.rank) {
					return b.game.score - a.game.score;
				}
				else {
					return a.rank - b.rank;
				}
			}
		}
		else if (rank_type == 'ilscore') {
			let total_ilscore = 0;
			for (let game of jammer.game_list) {
				total_ilscore += get_ilscore(
					game.game.score, game.num_games_in_jam
				);
			}

			total_ilscore_html = '\t\t<span>'
			                   + Math.round(total_ilscore).toString()
			                   + '</span>\n';

			sort_func = (a, b) => {
				return get_ilscore(b.game.score, b.num_games_in_jam)
				     - get_ilscore(a.game.score, a.num_games_in_jam);
			}
		}
		else {
			console.log("rank_type unhandled:", rank_type);
			Deno.exit();
		}

		let jammer_rank = page_num * page_size + i + 1;

		html += '\t\t<h3>' + html_link(
		                         jammer.author.link,
		                         jammer_rank.toString() + '. '
		                             + escape_html_special_chars(
		                                   jammer.author.name
		                               )
		                     ) + '</h3>\n'
		      + '\t\t<span>' + html_link(
		                           '../jammer/'
		                               + get_username(jammer.author.link)
		                               + '.html',
		                           'Jammer page'
		                       ) + '</span>\n'
		      + boxes_html
		      + total_ilscore_html
		      + get_games_table(
		            jammer,
		            get_max_rank_from_rank_type(rank_type),
		            sort_func,
		            false
		        )
		      + '\n';
	}

	return html;
}

function get_rank_type_links(
	in_rank_type: string, all_rank_types: string[]
): string {
	let html = '\t\t<div id="rank_type_links">\n';

	for (let i = 0; i < all_rank_types.length; i++) {
		let rank_type = all_rank_types[i];
	
		html += '\t\t\t<a '
		      + (in_rank_type == rank_type ? 'class="link_highlight" ' : '')
		      + 'href="' + 'by-' + rank_type + '-000000.html'
		      + '">' + rank_type + '</a>\n';
	}

	html += '\t\t</div>\n';
	return html;
}

function get_page_links(
	page_num: number, num_of_pages: number, rank_type: string
): string {
	let html = '\t\t<div class="page_links">\n';

	for (let i = 0; i < num_of_pages; i++) {
		html += '\t\t\t<a '
		      + (page_num == i ? 'class="link_highlight" ' : '')
		      + 'href="by-'
		      + rank_type + '-' + i.toString().padStart(6, "0")
		      + '.html">' + i.toString() + '</a>\n';
	}

	html += '\t\t</div>\n';
	return html;
}

function get_embed_desc(
	page: Jammer[], page_num: number, page_size: number
): string {
	let embed_str = "";
	for (let i = 0; i < page.length; i++) {
		let jammer_rank = page_num * page_size + i + 1;

		let jammer = page[i];

		embed_str += jammer_rank.toString() + ". "
		           + escape_html_special_chars(jammer.author.name) + "&#10;";
	}

	return '\t<meta content="' + embed_str + '" property="og:description">\n';
}

function write(
	page: Jammer[],
	page_num: number,
	page_size: number,
	rank_type: string,
	all_rank_types: string[],
	num_of_pages: number,
	nav_jam_list_path: string
): void {
	let embed_title = "Page " + page_num.toString() + " - ilScore leaderboard";
	if (rank_type != "ilscore") {
		embed_title = "Page " + page_num.toString()
		            + " - Leaderboard by games that got in top " + rank_type;
	}

	let sub_path = 'leaderboard/by-' + rank_type + '-'
	               + page_num.toString().padStart(6, "0")
	               + '.html';

	let html
	= '<!DOCTYPE html>\n'
	+ '<html>\n'
	+ '<head>\n'
	+     '\t<meta charset="UTF-8">\n'
	+     '\t<meta name="viewport" '
	          + 'content="width=device-width, initial-scale=1.0">\n'
	+     '\n'
	+     '\t<link rel="icon" href="' + ICON_PATH + '">\n'
	+     '\t<title>Unofficial Mini Jam Leaderboard</title>\n'
	+     '\t<meta content="Unofficial Mini Jam Leaderboard" '
	                          + 'property="og:site_name">\n'
	+     '\t<meta content="' + embed_title
	                          + '" property="og:title">\n'
	+     '\t<meta content="' + WEBSITE_URL + sub_path
	                          + '" property="og:url">\n'
	+     get_embed_desc(page, page_num, page_size)
	+     '\t<meta content="' + WEBSITE_URL + LARGE_EMBED_IMG_SUB_URL
	                          + '" property="og:image">\n'
	+     '\t<meta content="#ffa4a4" name="theme-color">\n'
	+     '\t<meta name="twitter:card" content="summary_large_image">\n'
	+     '\n'
	+     '\t<link rel="stylesheet" href="../css/share.css">\n'
	+     '\t<link rel="stylesheet" href="../css/leaderboard.css">\n'
	+ '</head>\n'
	+ '<body>\n'
	+     '\t<div id="content">\n'
	+         get_nav(nav_jam_list_path)
	+         '\t\t<h1>Unofficial Mini Jam Leaderboard</h1>\n'
	+         get_rank_type_links(rank_type, all_rank_types)
	+         get_page_links(page_num, num_of_pages, rank_type)
	+         '\n'
	+         get_jammer_list(page, page_num, page_size, rank_type)
	+         get_page_links(page_num, num_of_pages, rank_type)
	+     '\t</div>\n'
	+ '</body>\n'
	+ '</html>\n';

	write_file_and_print(DOCS_FOLDER_PATH + sub_path, html);
}

function pages(jammer_list: Jammer[], page_size: number): Array<Jammer[]> {
	let result_list: Array<Jammer[]> = [ [] ];

	for (let i = 0; i < jammer_list.length; i++) {
		let jammer = jammer_list[i];

		if (result_list[result_list.length - 1].length == page_size) {
			result_list.push([]);
		}

		result_list[result_list.length - 1].push(jammer);
	}

	return result_list;
}

export function write_leaderboard_pages(
	jammer_list_unsorted: Jammer[],
	sorted_jammer_list_list_list: Array< [string, Array<Jammer[]>] >,
	nav_jam_list_path: string
): void {
	let sorted_by_latest_jam_list_list: Array< [string, Array<Jammer>] >
		= sorted_jammer_list_list_list.map(
			([s, arr]) => [ s, arr[arr.length - 1] ]
		);

	let page_size = 10;
	let max_num_pages = 10;

	let paged_list_list_list: Array< [string, Array<Jammer[]> ] >
		= sorted_by_latest_jam_list_list.map(
			([s, arr]) => [s, pages(arr, page_size)]
		);


	for (let [s, arr] of paged_list_list_list) {
	for (let [i, page] of arr.entries()) {
		if (i >= max_num_pages) {
			break;
		}

		write(
			page,
			i,
			page_size,
			s,
			paged_list_list_list.map(([s, arr]) => s),
			Math.min(max_num_pages, arr.length),
			nav_jam_list_path
		);
	}
	}
}

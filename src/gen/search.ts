import { write_file_and_print } from "../share/file.ts";
import { DOCS_FOLDER_PATH } from "../share/consts.ts";
import { get_username } from "../share/utils.ts";

import { type Jammer } from "./jammer_list.ts";
import { get_nav } from "./html.ts";
import { WEBSITE_URL, ICON_PATH, SMALL_EMBED_IMG_SUB_URL } from "./links.ts";

function escape_js_special_chars(s: string): string {
	return s.replaceAll("<", "[SMALLER]")
	        .replaceAll(">", "[LARGER]")
	        .replaceAll("&", "[AND]")
	        .replaceAll('"', "[DOUBLE QUOTE]")
	        .replaceAll("'", "[SINGLE QUOTE]")
	        .replaceAll("\n", "[NEWLINE]")
	        .replaceAll("\r", "[NEWLINE BUT WORSE]")
	        .replaceAll("`", "[TICK]")
	        .replaceAll("\\", "[BACKSLASH]");
}

function get_jammer_list_js(jammer_list: Jammer[]): string {
	let html = '\t<script>\n'
	         +     '\t\tlet JAMMER_LIST = [\n';

	for (let i = 0; i < jammer_list.length; i++) {
		let jammer = jammer_list[i];

		html += '\t\t\t[ "'
		      + escape_js_special_chars(jammer.author.name)
		      + '", "'
		      + escape_js_special_chars(get_username(jammer.author.link))
		      + '" ],\n';
	}

	html +=     '\t\t];\n'
	      + '\t</script>\n';

	return html;
}

export function write_search_page(
	jammer_list: Jammer[], nav_jam_list_path: string
): void {
	let sub_path = "search/search.html";

	let html
	= '<!DOCTYPE html>\n'
	+ '<html>\n'
	+ '<head>\n'
	+     '\t<meta charset="UTF-8">\n'
	+     '\t<meta name="viewport" '
	          + 'content="width=device-width, initial-scale=1.0">\n'
	+     '\n'
	+     '\t<link rel="icon" href="' + ICON_PATH + '">\n'
	+     '\t<title>Jammer search</title>\n'
	+     '\t<meta content="Unofficial Mini Jam Leaderboard" '
	                          + 'property="og:site_name">\n'
	+     '\t<meta content="Jammer search" property="og:title">\n'
	+     '\t<meta content="' + WEBSITE_URL + sub_path
	                          + '" property="og:url">\n'
	+     '\t<meta content="Search for jammers by itch.io name or link" '
	                          + 'property="og:description">\n'
	+     '\t<meta content="' + WEBSITE_URL + SMALL_EMBED_IMG_SUB_URL
	                          + '" property="og:image">\n'
	+     '\t<meta content="#ffa4a4" name="theme-color">\n'
	+     '\n'
	+     '\t<link rel="stylesheet" href="../css/share.css">\n'
	+     '\t<link rel="stylesheet" href="../css/search.css">\n'
	+ '</head>\n'
	+ '<body>\n'
	+     '\t<div id="content">\n'
	+         get_nav(nav_jam_list_path)
	+         '\t\t<h1>Jammer search</h1>\n'
	+         '\n'
	+         '\t\t<input type="text" placeholder="Name or itch.io link">\n'
	+         '\t\t<button>Search</button>\n'
	+         '\n'
	+         '\t\t<div id="search_result"></div>\n'
	+     '\t</div>\n'
	+     get_jammer_list_js(jammer_list)
	+     '\t<script src="../js/search/search.js"></script>\n'
	+ '</body>\n'
	+ '</html>\n';

	write_file_and_print(DOCS_FOLDER_PATH + sub_path, html);
}

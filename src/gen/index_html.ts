import { write_file_and_print } from "../share/file.ts";
import { DOCS_FOLDER_PATH } from "../share/consts.ts";

import { WEBSITE_URL, ICON_PATH, LARGE_EMBED_IMG_SUB_URL } from "./links.ts";

export function write_index_html(): void {
	let redirect_to = "leaderboard/by-10-000000.html";

	let html
	= '<!DOCTYPE html>\n'
	+ '<html>\n'
	+ '<head>\n'
	+     '\t<meta charset="UTF-8">\n'
	+     '\t<meta name="viewport" '
	          + 'content="width=device-width, initial-scale=1.0">\n'
	+     '\n'
	+     '\t<meta http-equiv="refresh" content="0; url='
	          + redirect_to + '">\n'
	+     '\n'
	+     '\t<link rel="icon" href="' + ICON_PATH + '">\n'
	+     '\t<title>Unofficial Mini Jam Leaderboard</title>\n'
	+     '\t<meta content="&gt; &lt;" property="og:site_name">\n'
	+     '\t<meta content="' + 'Unofficial Mini Jam Leaderboard'
	                          + '" property="og:title">\n'
	+     '\t<meta content="' + WEBSITE_URL + '" property="og:url">\n'
	+     '\t<meta content="' + 'Hey hey, did you know that we have an '
	                          + 'unofficial leaderboard?'
	                          + '" property="og:description">\n'
	+     '\t<meta content="' + WEBSITE_URL + LARGE_EMBED_IMG_SUB_URL
	                          + '" property="og:image">\n'
	+     '\t<meta content="#ffa4a4" name="theme-color">\n'
	+     '\t<meta name="twitter:card" content="summary_large_image">\n'
	+     '\n'
	+     '\t<style>\n'
	+         '\t\t@media (prefers-color-scheme: dark) {\n'
	+             '\t\t\t* {\n'
	+                 '\t\t\t\tbackground-color: #1e1e1e;\n'
	+             '\t\t\t}\n'
	+     '\n'
	+             '\t\t\ta {\n'
	+                 '\t\t\t\tcolor: rgb(215, 215, 215);\n'
	+             '\t\t\t}\n'
	+         '\t\t}\n'
	+     '\t</style>\n'
	+ '</head>\n'
	+ '<body>\n'
	+     '\t<a href="' + redirect_to + '">Redirect</a>\n'
	+ '</body>\n'
	+ '</html>\n';

	write_file_and_print(DOCS_FOLDER_PATH + 'index.html', html);
}

import { fetch_or_refetch } from "../share/fetch.ts";
import {
	index_of_or_crash,
	get_start_end_pos_from_tags,
} from "../share/html.ts";

async function fetch_html(path: string): Promise<string> {
	let res = await fetch_or_refetch(path);
	let html = await res.text();
	return html;
}

export async function get_entries_json_link(jam_path: string): Promise<string> {
	let html = await fetch_html(jam_path);
	html = html.replaceAll("\r", "");

	let i_view_jam_start = index_of_or_crash(html, "I.ViewJam", 0);
	let ID_TAG = '"id":'

	let [id_start_1, id_end_1] = get_start_end_pos_from_tags(
		html,
		ID_TAG,
		',',
		i_view_jam_start
	);

	let [id_start_2, id_end_2] = get_start_end_pos_from_tags(
		html,
		ID_TAG,
		'}',
		i_view_jam_start
	);

	let id_start = id_start_1;
	let id_end = id_end_1 < id_end_2 ? id_end_1 : id_end_2;

	return "https://itch.io/jam/"
	     + html.substring(id_start, id_end)
	     + "/entries.json";
}

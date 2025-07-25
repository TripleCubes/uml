import { get_jam_from_cache } from "../share/cache_reader.ts";
import { type Jam } from "../share/types.ts";
import {
	write_file_and_print,
	get_file_list,
	remove_folder_and_print,
	create_folder_and_print,
} from "../share/file.ts";
import { CACHE_FOLDER_PATH, DOCS_FOLDER_PATH } from "../share/consts.ts";
import { get_max_jam_list_page } from "../share/utils.ts";

import { type Jammer, get_jammer_list_unsorted } from "./jammer_list.ts";
import { get_ilscore } from "./ilscore.ts";
import { copy_resource_folder } from "./resource.ts";
import { write_jammer_page } from "./jammer_page.ts";
import { write_jam_info_js } from "./jam_info_js.ts";
import { write_jam_list_pages } from "./jam_list.ts";
import { write_leaderboard_pages } from "./leaderboard.ts";
import { write_search_page } from "./search.ts";
import { write_stats_page } from "./stats.ts";
import { write_index_html } from "./index_html.ts";

function get_total_score(
	max_rank: number, max_jam_ordering: number, jammer: Jammer
): number {
	let total_score = 0;

	for (let i = 0; i < jammer.game_list.length; i++) {
		let game = jammer.game_list[i];

		if (game.rank > max_rank) {
			continue;
		}
		
		if (game.ordering_both > max_jam_ordering) {
			continue;
		}

		total_score += game.game.score;
	}

	return total_score;
}

let sort_by_score: (max_rank: number) => (max_jam_ordering: number) =>
(a: Jammer, b: Jammer) => number
	= max_rank => max_jam_ordering => (a, b) =>
	  get_total_score(max_rank, max_jam_ordering, b)
	- get_total_score(max_rank, max_jam_ordering, a);

function get_total_ilscore(max_jam_ordering: number, jammer: Jammer): number {
	let total_ilscore = 0;

	for (let i = 0; i < jammer.game_list.length; i++) {
		let game = jammer.game_list[i];

		if (game.ordering_both > max_jam_ordering) {
			continue;
		}

		total_ilscore += get_ilscore(game.game.score, game.num_games_in_jam);
	}

	return total_ilscore;
}

let sort_by_ilscore: (max_jam_ordering: number) =>
(a: Jammer, b: Jammer) => number
	= max_jam_ordering => (a, b) => get_total_ilscore(max_jam_ordering,b)
                                  - get_total_ilscore(max_jam_ordering,a);

async function main(): Promise<void> {
	let cached_file_list = await get_file_list(CACHE_FOLDER_PATH);
	let cached_path_list = cached_file_list.map(s => CACHE_FOLDER_PATH + s);
	let jam_list = cached_path_list.map(get_jam_from_cache)
	              .toSorted((a, b) => a.jam_end_at - b.jam_end_at);

	let jammer_list_unsorted = get_jammer_list_unsorted(jam_list);

	let sort_func_list: Array<[
		string, (max_jam_ordering: number) => (a: Jammer, b: Jammer) => number
	]> = [
		[ "1"      , sort_by_score(1 ) ],
		[ "5"      , sort_by_score(5 ) ],
		[ "10"     , sort_by_score(10) ],
		[ "20"     , sort_by_score(20) ],
		[ "ilscore", sort_by_ilscore   ],
	];

	let num_list = [... new Array(jam_list.length).keys()];
	let sort_func_list_expanded: Array<[
		string, Array< (a: Jammer, b: Jammer) => number >
	]> = sort_func_list.map( ([s, f]) => [s, num_list.map(f)] );

	let sorted_jammer_list_list_list: Array< [string, Array<Jammer[]>] >
		= sort_func_list_expanded.map(
			([s, arr]) => [s, arr.map( f => jammer_list_unsorted.toSorted(f) )]
		);


	let max_mj_id = jam_list.reduce(
		(acc, v) => (!v.is_majorjam && v.mj_id > acc) ? v.mj_id : acc, 1
	);
	let max_jam_list_page = get_max_jam_list_page(max_mj_id);
	let nav_jam_list_path = '../minijam/'
		+ max_jam_list_page.toString().padStart(6, "0") + '.html';


	remove_folder_and_print(DOCS_FOLDER_PATH);
	create_folder_and_print(DOCS_FOLDER_PATH);
	copy_resource_folder();
	write_jam_info_js(jam_list, jammer_list_unsorted.length);
	write_file_and_print(DOCS_FOLDER_PATH + ".nojekyll", "");

	create_folder_and_print(DOCS_FOLDER_PATH + "jammer/");

	for (let i = 0; i < jammer_list_unsorted.length; i++) {
		let jammer = jammer_list_unsorted[i];

		console.log(i);
		write_jammer_page(
			jammer,
			sorted_jammer_list_list_list,
			nav_jam_list_path
		);
	}

	create_folder_and_print(DOCS_FOLDER_PATH + "leaderboard/");
	write_leaderboard_pages(
		jammer_list_unsorted,
		sorted_jammer_list_list_list,
		nav_jam_list_path
	);

	create_folder_and_print(DOCS_FOLDER_PATH + "majorjam/");
	create_folder_and_print(DOCS_FOLDER_PATH + "minijam/");
	write_jam_list_pages(jam_list, nav_jam_list_path);

	create_folder_and_print(DOCS_FOLDER_PATH + "search/");
	write_search_page(jammer_list_unsorted, nav_jam_list_path);

	create_folder_and_print(DOCS_FOLDER_PATH + "stats/");
	write_stats_page(jammer_list_unsorted, jam_list, nav_jam_list_path);

	write_index_html();
}

function only_reload_resource(): void {
	copy_resource_folder();
}

main();
//only_reload_resource();

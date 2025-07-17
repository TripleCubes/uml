// TERMINOLOGIES: - JamResults refers to the data scrap from the `Results` page
//                  of the jam on itch.io
//                - JamEntries refers to the data from the itch.io's
//                  entries.json api, which is called in the jam's `Submissions`
//                  page

import { get_file_list } from "../share/file.ts";
import { type Author, type Game, type Jam } from "../share/types.ts";
import { get_jam_from_cache } from "../share/cache_reader.ts";
import {
	CACHE_FOLDER_PATH,
	MAJORJAM_PREFIX,
	MINIJAM_PREFIX
} from "../share/consts.ts";

import { get_jam_list } from "./jam_list.ts";
import {
	type JamResults,
	type Game as JamResult__Game,
	get_jam_results
} from "./jam_results.ts";
import {
	type JamEntries,
	type Game as JamEntries__Game,
	get_jam_entries
} from "./jam_entries.ts";
import { write_cache } from "./cache.ts";

let RESULT_SUB_PATH = "/results";
let RESULT_PAGE_PATH = "?page=";

async function get_jam(
	is_majorjam: boolean,
	ordering: number,
	jam_tuple: [number, string, string, string]
): Promise<Jam> {
	let [mj_id, jam_name, jam_link, entries_json_link] = jam_tuple;
	
	let first_page = await get_jam_results(jam_link + RESULT_SUB_PATH);
	let page_list = [ first_page ];
	for (let i = 2; i <= first_page.metadata.num_pages; i++) {
		page_list.push(await get_jam_results(
			jam_link + RESULT_SUB_PATH + RESULT_PAGE_PATH + i.toString()
		));
	}
	
	let game_list_from_results: JamResult__Game[] = [];
	for (let i = 0; i < page_list.length; i++) {
		let page = page_list[i];
		for (let j = 0; j < page.game_rated_list.length; j++) {
			let game = page.game_rated_list[j];
			game_list_from_results.push(game);
		}
	}

	let jam_entries = await get_jam_entries(entries_json_link);
	let game_list: Game[] = [];
	for (let i = 0; i < jam_entries.game_list.length; i++) {
		let game = jam_entries.game_list[i];
		let found = game_list_from_results.find(v => v.link == game.link);

		game_list.push({
			name: game.name,
			link: game.link,
			id: game.id,
			num_ratings: game.num_ratings,
			score: found == undefined ? 0 : found.score,
			submitted_at: game.submitted_at,
			author_list: game.author_list,
		});
	}

	game_list.sort(
		(a, b) => {
			if (a.score == b.score) {
				return b.id - a.id;
			}
			else {
				return b.score - a.score;
			}
		}
	);

	return {
		ordering: ordering,
		is_majorjam: is_majorjam,
		name: jam_name,
		mj_id: mj_id,
		link: jam_link,
		jam_end_at: first_page.metadata.jam_end_at,
		game_list: game_list,
	};
}

function game_equals(game: Game, jam_entries__game: JamEntries__Game): boolean {
	if (game.name != jam_entries__game.name) {
		return false;
	}

	if (game.link != jam_entries__game.link) {
		return false;
	}


	if (game.author_list.length != jam_entries__game.author_list.length) {
		return false;
	}

	for (let i = 0; i < game.author_list.length; i++) {
		let author = game.author_list[i];
		let jam_entries__author = jam_entries__game.author_list.find(
			v => v.link == author.link
		);

		if (jam_entries__author == undefined) {
			return false;
		}
		else {
			if (author.name != jam_entries__author.name) {
				return false;
			}
		}
	}

	return true;
}

function print_author_list(author_list: Author[]): void {
	for (let i = 0; i < author_list.length; i++) {
		let author = author_list[i];
		console.log("\t\t" + author.name, author.link);
	}
}

function incremental(cached_jam: Jam, jam_entries: JamEntries): Jam {
	let game_list: Game[] = [];

	for (let i = 0; i < cached_jam.game_list.length; i++) {
		let cached_game = cached_jam.game_list[i];
		let found = jam_entries.game_list.find(v => v.id == cached_game.id);

		if (found == undefined) {
			console.log(
				"\t[REMOVED ]",
				cached_game.id,
				cached_game.name,
				cached_game.link
			);
		}
		else {
			if (!game_equals(cached_game, found)) {
				console.log("\t[MODIFIED]", cached_game.id);

				console.log(
					"\tfrom",
					cached_game.name,
					cached_game.link
				);
				print_author_list(cached_game.author_list);

				console.log(
					"\tto  ",
					found.name,
					found.link,
				);
				print_author_list(found.author_list);

				game_list.push({
					name: found.name,
					link: found.link,
					id: cached_game.id,
					num_ratings: cached_game.num_ratings,
					score: cached_game.score,
					submitted_at: cached_game.submitted_at,
					author_list: found.author_list,
				});
			}
			else {
				game_list.push(cached_game);
			}
		}
	}

	return {
		ordering: cached_jam.ordering,
		is_majorjam: cached_jam.is_majorjam,
		name: cached_jam.name,
		mj_id: cached_jam.mj_id,
		link: cached_jam.link,
		jam_end_at: cached_jam.jam_end_at,
		game_list: game_list,
	};
}

async function scrap(
	is_majorjam: boolean, list: Array<[number, string, string, string]>
): Promise<void> {
	let cache_file_list = await get_file_list(CACHE_FOLDER_PATH);

	for (let i = 0; i < list.length; i++) {
		let jam_tuple = list[i];
		let [mj_id, jam_name, jam_link, entries_json_link] = jam_tuple;
		console.log("JAM", mj_id, jam_name, jam_link);

		let ordering = (list.length - i - 1)
		let cache_file_name
			= (is_majorjam ? MAJORJAM_PREFIX : MINIJAM_PREFIX)
			+ "_" + ordering.toString().padStart(6, "0")
			+ "_" + mj_id.toString()
			+ "_" + jam_name.replaceAll(" ", "_")
			+ ".txt";

		let index = cache_file_list.indexOf(cache_file_name);

		if (index == -1) {
			let jam = await get_jam(is_majorjam, ordering, jam_tuple);
			write_cache(CACHE_FOLDER_PATH + cache_file_name, jam);
		}
		else {
			let cached_jam = get_jam_from_cache(
				CACHE_FOLDER_PATH + cache_file_name
			);
			let jam_entries = await get_jam_entries(entries_json_link);
			
			let jam = incremental(cached_jam, jam_entries);
			write_cache(CACHE_FOLDER_PATH + cache_file_name, jam);
		}

		console.log("");
	}
}

async function main(): Promise<void> {
	let [majorjam_list, minijam_list] = get_jam_list();

	console.log("MAJORJAM");
	await scrap(true, majorjam_list);
	console.log("MINIJAM");
	await scrap(false, minijam_list);
}

main();

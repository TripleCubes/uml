import { type Author, type Game, type Jam } from "./types.ts";
import { read_file_and_print } from "./file.ts";
import { MAJORJAM_PREFIX } from "./consts.ts";

function to_game(arr: string[]): Game {
	let author_list: Author[] = [];
	for (let i = 6; i < arr.length; i += 2) {
		author_list.push({
			name: arr[i],
			link: "https://" + arr[i + 1] + ".itch.io",
		});
	}

	return {
		name: arr[0],
		link: arr[1],
		id: Number(arr[2]),
		num_ratings: Number(arr[3]),
		score: Number(arr[4]),
		submitted_at: Number(arr[5]),
		author_list: author_list,
	};
}

export function get_jam_from_cache(path: string): Jam {
	let file_text = read_file_and_print(path).replaceAll("\r", "");

	let game_list_text = file_text.substring(file_text.indexOf("\n\n") + 2);
	let game_list_text_splitted = game_list_text.split("\n\n");
	let game_list: Game[] = [];
	for (let i = 0; i < game_list_text_splitted.length; i++) {
		let game_text = game_list_text_splitted[i];
		game_list.push(to_game(game_text.split("\n").filter(s => s != "")));
	}

	let jam_info_text = file_text.substring(0, file_text.indexOf("\n\n"));
	let jam_info_text_splitted = jam_info_text.split("\n");

	return {
		ordering: Number(jam_info_text_splitted[0]),
		is_majorjam: jam_info_text_splitted[1] == MAJORJAM_PREFIX,
		name: jam_info_text_splitted[2],
		mj_id: Number(jam_info_text_splitted[3]),
		link: jam_info_text_splitted[4],
		jam_end_at: Number(jam_info_text_splitted[5]),
		game_list: game_list,
	};
}

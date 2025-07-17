import { type Jam, type Game, type Author } from "../share/types.ts";
import { INFINITE } from "../share/consts.ts"

export type JammerGame = {
	is_majorjam: boolean;
	mj_id: number;
	ordering_both: number;
	jam_name: string;
	jam_link: string;
	rank: number;
	num_games_in_jam: number;
	jam_end_at: number;
	game: Game;
};

export type Jammer = {
	author: Author;
	game_list: JammerGame[];
};

function get_jammergame_list(jam_list: Jam[]): JammerGame[] {
	let jammergame_list: JammerGame[] = [];

	for (let [jam_index, jam] of jam_list.entries()) {
		let current_rank = 0;

		for (let [game_index, game] of jam.game_list.entries()) {
			let prev_game: Game = {
				name: "",
				link: "",
				id: 0,
				num_ratings: 0,
				score: 0,
				submitted_at: 0,
				author_list: [],
			};
			if (game_index - 1 >= 0) {
				prev_game = jam.game_list[game_index - 1];
			}

			let rank = 0;
			if (prev_game.score == game.score) {
				rank = current_rank;
			}
			else {
				rank = game_index + 1;
				current_rank = game_index + 1;
			}

			if (game.score == 0) {
				rank = INFINITE;
			}

			jammergame_list.push({
				is_majorjam: jam.is_majorjam,
				mj_id: jam.mj_id,
				ordering_both: jam_index,
				jam_name: jam.name,
				jam_link: jam.link,
				rank: rank,
				num_games_in_jam: jam.game_list.length,
				jam_end_at: jam.jam_end_at,
				game: game,
			});
		}
	}

	return jammergame_list;
}

export function get_jammer_list_unsorted(jam_list: Jam[]): Jammer[] {
	let jammergame_list = get_jammergame_list(jam_list);
	let jammer_list: Jammer[] = [];

	for (let game of jammergame_list) {
	for (let author of game.game.author_list) {
		let found = jammer_list.find(v => v.author.link == author.link);

		if (found == undefined) {
			jammer_list.push({ author: author, game_list: [ game ] });
		}
		else {
			found.game_list.push(game);
		}
	}
	}

	return jammer_list;
}

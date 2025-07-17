import { write_file_and_print } from "../share/file.ts";
import { type Game, type Jam } from "../share/types.ts";
import { MAJORJAM_PREFIX, MINIJAM_PREFIX } from "../share/consts.ts";
import { get_username } from "../share/utils.ts";

export function write_cache(path: string, jam: Jam): void {
	let s = jam.ordering.toString() + "\n"
	      + (jam.is_majorjam ? MAJORJAM_PREFIX : MINIJAM_PREFIX) + "\n"
	      + jam.name + "\n"
	      + jam.mj_id.toString() + "\n"
	      + jam.link + "\n"
	      + jam.jam_end_at.toString() + "\n\n";

	for (let i = 0; i < jam.game_list.length; i++) {
		let game = jam.game_list[i];

		s += game.name.replaceAll("\n", "[NEWLINE]") + "\n"
		   + game.link + "\n"
		   + game.id.toString() + "\n"
		   + game.num_ratings.toString() + "\n"
		   + game.score.toString() + "\n"
		   + game.submitted_at.toString() + "\n";

		for (let j = 0; j < game.author_list.length; j++) {
			let author = game.author_list[j];

			s += author.name.replaceAll("\n", "[NEWLINE]") + "\n"
			   + get_username(author.link) + "\n";
		}

		if (i != jam.game_list.length - 1) {
			s += "\n";
		}
	}

	write_file_and_print(path, s);
}

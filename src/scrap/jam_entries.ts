import { fetch_or_refetch } from "../share/fetch.ts"
import { json_verify_or_crash } from "../share/json.ts";
import { type Author } from "../share/types.ts";

export type Game = {
	name: string;
	link: string;
	id: number;
	num_ratings: number;
	submitted_at: number;
	
	author_list: Author[];
};

export type JamEntries = {
	game_list: Game[];
};

export async function get_jam_entries(path: string): Promise<JamEntries> {
	let res = await fetch_or_refetch(path);
	let json = await res.json();

	json_verify_or_crash(json, { generated_on: 0, jam_games: [{}] });

	let game_list: Game[] = [];

	for (let i = 0; i < json.jam_games.length; i++) {
		let game_json = json.jam_games[i];

		let game_comp = {
			rating_count: 0,
			id: 0,
			coolness: 0,
			url: "",
			created_at: "",
			game: {
				// the commented out properties are properties that not all
				// games have. I keep them there because I felt like so
				//cover_color: "",
				id: 0,
				title: "",
				//platforms: [""],
				//short_text: "",
				url: "",
				cover: "",
				user: {
					id: 0,
					url: "",
					name: "",
				},
			},
		};
		json_verify_or_crash(game_json, game_comp);

		let author_list: Author[] = [];
		if (Object.hasOwn(game_json, "contributors")) {
			if (!Array.isArray(game_json.contributors)) {
				console.log('"contributors" property is not an array');
				Deno.exit();
			}

			for (let i = 0; i < game_json.contributors.length; i++) {
				let contributor = game_json.contributors[i];
				json_verify_or_crash(contributor, { name: "", url: "" });
				author_list.push(
					{ name: contributor.name, link: contributor.url }
				);
			}
		}
		else {
			author_list.push({
				name: game_json.game.user.name,
				link: game_json.game.user.url,
			});
		}

		let game: Game = {
			name: game_json.game.title,
			link: game_json.game.url,
			id: game_json.game.id,
			num_ratings: game_json.rating_count,
			submitted_at: Date.parse(game_json.created_at + " UTC"),
			
			author_list: author_list,
		};

		game_list.push(game);
	}

	return { game_list: game_list };
}

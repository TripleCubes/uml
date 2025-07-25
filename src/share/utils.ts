import { JAM_LIST_PAGE_SPLIT_SIZE } from "./consts.ts";

export function get_username(link: string): string {
	return link.replaceAll("https://", "").replaceAll(".itch.io", "");
}

export function get_max_jam_list_page(max_mj_id: number): number {
	return Math.ceil(max_mj_id / JAM_LIST_PAGE_SPLIT_SIZE)
	     * JAM_LIST_PAGE_SPLIT_SIZE - (JAM_LIST_PAGE_SPLIT_SIZE - 1);
}

let EMOJI_LIST = [
	"&#x1F47B;", // ghost
	"&#x1F338;", // cherry blossom

	"&#x1F3B2;", // dice
	"&#x1F9CA;", // ice cube
	"&#x1F4E6;", // cube

	"&#x1F36E;", // pudding
	"&#x1F9C1;", // cupcake
	"&#x1F368;", // ice cream
	"&#x1F366;", // another ice cream
	"&#x1F95E;", // pancake
	"&#x1F9C7;", // waffle
	"&#x1F9C0;", // cheese
	"&#x1F35C;", // noodle
	"&#x1F37F;", // popcorn
	"&#x1F35E;", // bread
	"&#x1F959;", // another bread
	"&#x1FAD3;", // another another bread

	"&#x1F340;", // clover
	"&#x1F343;", // leaf
	"&#x1F332;", // tree
	"&#x1F96C;", // vegetable

	"&#x1F41F;", // fish
	"&#x1F420;", // another fish
	"&#x1F422;", // turtle
	"&#x1F364;", // fried shrimp

	"&#x1F34E;", // apple
	"&#x1F347;", // grapes
	"&#x1F34C;", // banana
	"&#x1F965;", // coconut
	"&#x1F349;", // watermelon
	"&#x1F348;", // melon
	"&#x1F955;", // carrot
	"&#x1F352;", // cherries
	"&#x1FAD0;", // blueberries

	"&#x1F381;", // present
	"&#x1F4D4;", // book
	"&#x1F4D3;", // another book
	"&#x1F4DA;", // stack of books

	"&#x1F375;", // tea
	"&#x1F964;", // cup
	"&#x1FAD6;", // tea pot
	"&#x1F9CB;", // boba
	"&#x1F95B;", // milk

	"&#x1F4A1;", // bulb

	"&#x1F643;", // up side down

	"&#x1F30A;", // water wave

	"&#x1F682;", // train

	"&#x1F984;", // unicorn
];

export function get_random_emoji(): string {
	let i = Math.floor(Math.random() * EMOJI_LIST.length);
	return EMOJI_LIST[i];
}

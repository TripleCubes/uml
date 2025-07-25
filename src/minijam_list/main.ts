import { fetch_or_refetch } from "../share/fetch.ts";
import { json_verify_or_crash } from "../share/json.ts";
import { get_entries_json_link } from "./entries_json_link.ts";

let API_LINK = 'https://minijamofficial.com/api/fetchMiniJams?n=';

type Page = {
	id_list: number[];
	name_list: string[];
	link_list: string[];
};

async function fetch_page(path: string): Promise<Page> {
	let res = await fetch_or_refetch(path);
	let json = await res.json();

	let comp = {
		jamId: [0],
		jamName: [""],
		jamLink: [""],
		jamImage: [""],
	};
	json_verify_or_crash(json, comp);

	return {
		id_list: json.jamId,
		name_list: json.jamName,
		link_list: json.jamLink,
	};
}

async function get_jam_from_page(page: Page, index: number)
: Promise<[number, string, string, string]> {
	return [
		page.id_list[index],
		page.name_list[index].replaceAll("\r", ""),
		page.link_list[index].replaceAll("\r", ""),
		await get_entries_json_link(
			page.link_list[index].replaceAll("\r", "")
		),
	];
}

async function main(): Promise<void> {
	let first_page = await fetch_page(API_LINK + "0");
	let max_jam_id = first_page.id_list[0];
	let num_page = Math.ceil((max_jam_id - 1) / 9) + 1;

	let jam_list = [ await get_jam_from_page(first_page, 0) ];

	for (let i = 1; i < num_page; i++) {
		let page = await fetch_page(API_LINK + i.toString());
		for (let j = 0; j < page.link_list.length; j++) {
			jam_list.push(await get_jam_from_page(page, j));
		}
	}

	for (let i = 0; i < jam_list.length; i++) {
		let [id, name, link, entries_json] = jam_list[i];
		console.log(
			id.toString() + "|" + name + "|" + link + "|" + entries_json
		);
	}
}

main();

import { read_file_and_print } from "../share/file.ts";

let FILE_PATH = "input/jam_list.txt";
let MAJORJAM_TAG = "MAJORJAM";
let MINIJAM_TAG = "MINIJAM";

function str_to_tuple(s: string): [number, string, string, string] {
	let arr = s.split("|");
	return [ Number(arr[0]), arr[1], arr[2], arr[3] ];
}

export function get_jam_list(): [
	Array<[number, string, string, string]>,
	Array<[number, string, string, string]>
] {
	let s = read_file_and_print(FILE_PATH).replaceAll("\r", "");

	let majorjam_list_start = s.indexOf(MAJORJAM_TAG) + MAJORJAM_TAG.length;
	let majorjam_list_end = s.indexOf(MINIJAM_TAG);
	let minijam_list_start = s.indexOf(MINIJAM_TAG) + MINIJAM_TAG.length;

	let majorjam_list = s.substring(majorjam_list_start, majorjam_list_end)
	                     .split("\n")
	                     .filter(s => s != "")
	                     .map(str_to_tuple);
	let minijam_list  = s.substring(minijam_list_start)
	                     .split("\n")
	                     .filter(s => s != "")
	                     .map(str_to_tuple);

	return [majorjam_list, minijam_list];
}

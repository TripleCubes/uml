import { type Jam } from "../share/types.ts";
import { write_file_and_print } from "../share/file.ts";
import { DOCS_FOLDER_PATH, INFINITE } from "../share/consts.ts";

export function write_jam_info_js(jam_list: Jam[], num_jammers: number): void {
	let s = 'let INFINITE = ' + INFINITE.toFixed() + ';\n'
	      + 'let NUM_JAMMERS = ' + num_jammers.toString() + ';\n'
	      + 'let JAM_INFO_LIST = [\n';

	for (let i = 0; i < jam_list.length; i++) {
		let jam = jam_list[i];

		s += '\t{\n'
		+     '\t\tis_majorjam: ' + (jam.is_majorjam ? 'true' : 'false') + ',\n'
		+     '\t\tmj_id: ' + jam.mj_id + ',\n'
		+ '\t},\n';
	}

	s += '];\n';
	write_file_and_print(DOCS_FOLDER_PATH + "js/jammer_page/jam_info.js", s);
}

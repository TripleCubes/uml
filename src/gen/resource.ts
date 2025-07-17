import {
	create_folder_and_print,
	copy_file_and_print,
} from "../share/file.ts";
import { DOCS_FOLDER_PATH, RESOURCE_FOLDER_PATH } from "../share/consts.ts";

function copy_resource(sub_path: string): void {
	copy_file_and_print(
		RESOURCE_FOLDER_PATH + sub_path,
		DOCS_FOLDER_PATH + sub_path
	);
}

export function copy_resource_folder(): void {
	create_folder_and_print(DOCS_FOLDER_PATH + "css/");
	create_folder_and_print(DOCS_FOLDER_PATH + "js/jammer_page/");
	create_folder_and_print(DOCS_FOLDER_PATH + "js/search/");
	create_folder_and_print(DOCS_FOLDER_PATH + "image/icon/");
	create_folder_and_print(DOCS_FOLDER_PATH + "image/embed/");

	copy_resource("css/share.css");
	copy_resource("css/jammer_page.css");
	copy_resource("css/jam_list.css");
	copy_resource("css/leaderboard.css");
	copy_resource("css/search.css");
	copy_resource("css/stats.css");
	copy_resource("js/jammer_page/rank_graph.js");
	copy_resource("js/jammer_page/sort_btn.js");
	copy_resource("js/search/search.js");
	copy_resource("image/icon/icon.png");
	copy_resource("image/embed/large.png");
	copy_resource("image/embed/small.png");
}

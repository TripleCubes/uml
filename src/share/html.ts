// the word "tag" in this project does not refer to a html tag, but strings used
// to specify the start and end of a search target

export function index_of_or_crash(
	s: string, find: string, search_start_index: number
): number {
	let index = s.indexOf(find, search_start_index);
	if (index == -1) {
		console.log('"' + find + '" not found');
		Deno.exit();
	}
	return index;
}

export function get_start_end_pos_from_tags(
	s: string, start_tag: string, end_tag: string, search_start_index: number
): [number, number] {
	let content_start = index_of_or_crash(s, start_tag, search_start_index)
	                  + start_tag.length;
	let content_end = index_of_or_crash(s, end_tag, content_start);

	return [content_start, content_end];
}

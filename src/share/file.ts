export function read_file_and_print(path: string): string {
	let s = Deno.readTextFileSync(path);
	console.log("[READED ]", path);
	return s;
}

export function write_file_and_print(path: string, content: string): void {
	Deno.writeTextFileSync(path, content);
	console.log("[WRITTEN]", path);
}

export async function get_file_list(path: string): Promise<string[]> {
	let file_list: string[] = [];

	for await (const entry of Deno.readDir(path)) {
		file_list.push(entry.name);
	}

	file_list.sort();

	return file_list;
}

export function remove_folder_and_print(path: string): void {
	Deno.removeSync(path, { recursive: true });
	console.log("[REMOVED]", path);
}

export function create_folder_and_print(path: string): void {
	Deno.mkdirSync(path, { recursive: true });
	console.log("[CREATED]", path);
}

export function copy_file_and_print(from: string, to: string): void {
	Deno.copyFileSync(from, to);
	console.log("[COPIED ]", from, "->", to);
}

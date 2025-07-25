function get_type(a: any): string {
	let t = typeof a;
	if (t == "object") {
		return Array.isArray(a) ? "array" : "object";
	}
	return t;
}

// this function will treat all type of arrays as the same type. it will also
// not recursive check into arrays
export function json_verify_or_crash(json: any, comp: any): void {
	let key_list = Object.keys(comp);

	for (let i = 0; i < key_list.length; i++) {
		let key = key_list[i];
		
		if (get_type(comp[key]) != get_type(json[key])) {
			console.log(
				"json verify failed:",
				"comp." + key + ": " + get_type(comp[key]) + ",",
				"json." + key + ": " + get_type(json[key]),
			);
			Deno.exit();
		}

		if (get_type(comp[key]) == "object") {
			json_verify_or_crash(json[key], comp[key]);
		}
	}
}

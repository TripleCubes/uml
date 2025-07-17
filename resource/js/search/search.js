function search() {
	let input = document.querySelector("input");

	if (input.value.replaceAll(" ", "") == "") {
		return;
	}

	let found_list = JAMMER_LIST.filter(
		([name, username]) => {
			return name.toLowerCase().indexOf(input.value.toLowerCase()) != -1
			|| username.toLowerCase().indexOf(input.value.toLowerCase()) != -1;
		}
	);

	let search_result_div = document.querySelector("#search_result");
	search_result_div.innerHTML = "";

	for (let i = 0; i < found_list.length; i++) {
		if (i >= 100) {
			let div = document.createElement("div");
			div.innerHTML = "...";
			search_result_div.appendChild(div);
			break;
		}

		let [name, username] = found_list[i];
	
		let div = document.createElement("div");

		let itch_link = document.createElement("a");
		itch_link.href = 'https://' + username + '.itch.io';
		itch_link.innerHTML = name;

		div.appendChild(itch_link);

		let jammer_page_link = document.createElement("a");
		jammer_page_link.href = '../jammer/' + username + '.html';
		jammer_page_link.innerHTML = "Jammer page";

		div.appendChild(jammer_page_link);

		search_result_div.appendChild(div);
	}
}

document.querySelector("input").addEventListener("keyup", (event) => {
	if (event.key == "Enter") {
		search();
	}
});
document.querySelector("button").addEventListener("click", search);

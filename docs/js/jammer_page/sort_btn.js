let SORTING_BY_JAM = "Sorting by jam";
let SORTING_BY_RANK = "Sorting by rank";
let SORTING_BY_ILSCORE = "Sorting by ilScore";

let tr_list_cache = [];

function games_table_sort(sort_func) {
	let tbody = document.querySelector("#games_table > tbody");
	tbody.innerHTML = "";

	let tr_list_sorted = tr_list_cache.toSorted(sort_func);

	for (let i = 0; i < tr_list_sorted.length; i++) {
		let tr = tr_list_sorted[i];
		tbody.appendChild(tr.cloneNode(true));
	}
}

function games_table_set_from_cache() {
	let tbody = document.querySelector("#games_table > tbody");
	tbody.innerHTML = "";

	for (let i = 0; i < tr_list_cache.length; i++) {
		let tr = tr_list_cache[i];
		tbody.appendChild(tr.cloneNode(true));
	}
}

// reusing str_is_valid_number() and get_game_rank() from rank_graph.js

function get_ilscore(tr) {
	let ilscore_str = Array.from(tr.querySelectorAll("td"))[7].innerHTML;

	if (str_is_valid_number(ilscore_str)) {
		return Number(ilscore_str);
	}
	else {
		return 0;
	}
}

function setup_sort_btn() {
	let sort_btn = document.querySelector("#sort_btn");
	sort_btn.style.display = "inline-block";

	let tr_list = Array.from(
		document.querySelectorAll("#games_table tbody > tr")
	);
	for (let i = 0; i < tr_list.length; i++) {
		let tr = tr_list[i];

		tr_list_cache.push(tr.cloneNode(true));
	}

	sort_btn.addEventListener("click", () => {
		if (sort_btn.innerHTML == SORTING_BY_JAM) {
			sort_btn.innerHTML = SORTING_BY_RANK;
			games_table_sort((a, b) => get_game_rank(a) - get_game_rank(b));
		}
		
		else if (sort_btn.innerHTML == SORTING_BY_RANK) {
			sort_btn.innerHTML = SORTING_BY_ILSCORE;
			games_table_sort((a, b) => get_ilscore(b) - get_ilscore(a));
		}

		else if (sort_btn.innerHTML == SORTING_BY_ILSCORE) {
			sort_btn.innerHTML = SORTING_BY_JAM;
			games_table_set_from_cache();
		}
	});
}

setup_sort_btn();

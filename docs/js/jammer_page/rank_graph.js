// yes I know, this is a const, and I am modifying it. my defense is this is
// the only place where I modify this const, after this no other code will
// modify it
for (let i = 0; i < ORDERING_LIST_LIST.length; i++) {
	let arr = ORDERING_LIST_LIST[i][1];

	ORDERING_LIST_LIST[i][1] = new Array(JAM_INFO_LIST.length - arr.length)
	                          .fill(INFINITE).concat(arr);
}

function get_is_majorjam_and_mj_id(tr) {
	let s = Array.from(tr.querySelectorAll("td"))[3]
	       .querySelector("a").innerHTML;
	let tag = s.substring(0, s.indexOf(":"));
	
	if (tag.includes("MJ+ ")) {
		return [true, Number(tag.substring("MJ+ ".length))];
	}
	else if (tag.includes("MJ ")) {
		return [false, Number(tag.substring("MJ ".length))];
	}
	else {
		console.log(
			'ERROR: "MJ " and "MJ+ " not found. this error should',
			'not be able to happens'
		);
	}
}

function get_games_by_jam_ordering(ordering) {
	let tr_list = Array.from(
		document.querySelectorAll("#games_table tbody > tr")
	);
	let game_list = [];

	for (let i = 0; i < tr_list.length; i++) {
		let tr = tr_list[i];
		let [is_majorjam, mj_id] = get_is_majorjam_and_mj_id(tr);

		if (
			is_majorjam == JAM_INFO_LIST[ordering].is_majorjam
			&& mj_id == JAM_INFO_LIST[ordering].mj_id
		) {
			game_list.push(tr);
		}
	}

	return game_list;
}

function get_max_rank_allowed_from_rank_type_str(rank_type) {
	if (
		   rank_type == "1"
		|| rank_type == "5"
		|| rank_type == "10"
		|| rank_type == "20"
	) {
		return Number(rank_type);
	}

	return INFINITE;
}

function get_worse_ordering() {
	let max = 0;

	for (let [s, arr] of ORDERING_LIST_LIST) {
	for (let [jam_ordering, ordering] of arr.entries()) {
		let max_rank = get_max_rank_allowed_from_rank_type_str(s);
		let first_jam_ordering = get_first_jam_ordering(max_rank);

		if (jam_ordering < first_jam_ordering) {
			continue;
		}

		if (ordering > max) {
			max = ordering;
		}
	}
	}

	return max;
}

function get_jam_ordering_from_is_majorjam_and_mj_id(is_majorjam, mj_id) {
	let index = JAM_INFO_LIST.findIndex(
		v => v.is_majorjam == is_majorjam && v.mj_id == mj_id
	);

	if (index == -1) {
		console.log(
			"can not find ordering from is_majorjam and mj_id.",
			"this err should not be able to happens"
		);
	}

	return index;
}

function str_is_valid_number(s) {
	for (let i = 0; i < s.length; i++) {
		let c = s[i];

		if (c >= "0" && c <= "9") {
			continue;
		}

		if (c == ".") {
			continue;
		}

		return false;
	}

	return true;
}

function get_game_rank(game) {
	let rank_str
		= Array.from(game.querySelectorAll("td"))[5].innerHTML;

	if (str_is_valid_number(rank_str)) {
		return Number(rank_str);
	}
	else {
		return INFINITE;
	}
}

function get_first_jam_ordering(max_rank) {
	let game_list = Array.from(
		document.querySelectorAll("#games_table tbody > tr")
	);
	let min_ordering = INFINITE;

	for (let i = 0; i < game_list.length; i++) {
		let game = game_list[i];
		let rank = get_game_rank(game);

		if (rank > max_rank) {
			continue;
		}

		let [is_majorjam, mj_id] = get_is_majorjam_and_mj_id(game);
		let ordering = get_jam_ordering_from_is_majorjam_and_mj_id(
			is_majorjam, mj_id
		);

		if (ordering < min_ordering) {
			min_ordering = ordering;
		}
	}

	return min_ordering;
}

function create_label(i) {
	let label = document.createElement("span");
	let is_majorjam = JAM_INFO_LIST[i].is_majorjam;
	let mj_id = JAM_INFO_LIST[i].mj_id;
	label.innerHTML = (is_majorjam ? "MJ+ " : "MJ ")
	                + mj_id.toString();

	let label_interval = 10;
	if (
		   (!is_majorjam && mj_id % label_interval == 0)
		|| is_majorjam
		|| i == JAM_INFO_LIST.length - 1
	) {
		label.style.display = "block";
	}

	return label;
}

function create_rank_point_list(i, game_list, worse_ordering) {
	let rank_point_list = [];
	
	for (let [s, arr] of ORDERING_LIST_LIST) {
		let max_rank = get_max_rank_allowed_from_rank_type_str(s);
		let first_jam_ordering = get_first_jam_ordering(max_rank);

		if (i < first_jam_ordering) {
			continue;
		}

		let ordering = arr[i];

		let rank_point = document.createElement("div");
		rank_point.classList.add("rank_point");
		rank_point.classList.add("rank_point_" + s);
		for (let game of game_list) {
			let game_rank = get_game_rank(game);
			if (game_rank <= max_rank) {
				rank_point.classList.add("game_point");
				break;
			}
		}
		rank_point.style.top
			= ((ordering / worse_ordering) * 100).toString() + "%";

		rank_point_list.push(rank_point);
	}

	return rank_point_list;
}

function create_connect_list(i, worse_ordering) {
	let connect_list = [];

	for (let [s, arr] of ORDERING_LIST_LIST) {
		if (i == JAM_INFO_LIST.length - 1) {
			continue;
		}

		let max_rank = get_max_rank_allowed_from_rank_type_str(s);
		let first_jam_ordering = get_first_jam_ordering(max_rank);

		if (i < first_jam_ordering) {
			continue;
		}

		let ordering = arr[i];
		let nx_ordering = arr[i + 1];

		let connect = document.createElement("div");
		let span_w_px = 30;
		let span_h_px = 200 - 2;
		let top = ordering / worse_ordering * span_h_px;
		let height = nx_ordering / worse_ordering * span_h_px - top;
		let angle = Math.atan(height / span_w_px);
		connect.classList.add("connect");
		connect.classList.add("connect_" + s);
		connect.style.transform = "translateY(-50%) "
		                        + "rotate(" + angle.toString() + "rad)";
		connect.style.top = top.toString() + "px";
		connect.style.width
			= Math.sqrt(height * height + span_w_px * span_w_px).toString()
			+ "px";

		connect_list.push(connect);
	}

	return connect_list;
}

function create_tooltip(i, game_list) {
	let tooltip = document.createElement("div");
	tooltip.classList.add("tooltip");

	let tooltip_rank_by_container = document.createElement("div");
	tooltip_rank_by_container.classList.add("tooltip_rank_by_container");
	for (let [s, arr] of ORDERING_LIST_LIST) {
		let max_rank = get_max_rank_allowed_from_rank_type_str(s);
		let first_jam_ordering = get_first_jam_ordering(max_rank);

		if (i < first_jam_ordering) {
			continue;
		}

		let rank = arr[i] + 1;
		let rank_by = document.createElement("span");
		rank_by.classList.add("tooltip_rank_by_" + s);
		
		let bold = document.createElement("span");
		bold.innerHTML = "by " + s + ": ";
		rank_by.appendChild(bold);
		let num = document.createElement("span");
		num.innerHTML = rank.toString();
		rank_by.appendChild(num);

		tooltip_rank_by_container.appendChild(rank_by);
	}
	tooltip.appendChild(tooltip_rank_by_container);

	if (game_list.length != 0) {
		let tooltip_games_container = document.createElement("div");
		tooltip_games_container.classList.add("tooltip_games_container");
		for (let game of game_list) {
			let table = document.createElement("table");
			let tbody = document.createElement("tbody");
			tbody.appendChild(game.cloneNode(true)); // game is a <tr></tr>
			table.appendChild(tbody);
			tooltip_games_container.appendChild(table);
		}
		tooltip.appendChild(tooltip_games_container);
	}

	if (tooltip_rank_by_container.children.length == 0) {
		return undefined;
	}

	return tooltip;
}

function create_rank_graph() {
	document.querySelector("#graph_explains").style.display = "block";

	let graph = document.querySelector("#graph");
	let worse_ordering = get_worse_ordering();

	let rank_number_top = document.createElement("div");
	rank_number_top.innerHTML = "rank 1";
	graph.appendChild(rank_number_top);

	let rank_number_bottom = document.createElement("div");
	rank_number_bottom.innerHTML = "rank " + (worse_ordering + 1).toString()
	                             + " of " + NUM_JAMMERS;
	graph.appendChild(rank_number_bottom);

	for (let i = 0; i < JAM_INFO_LIST.length; i++) {
		let span = document.createElement("span");

		let game_list = get_games_by_jam_ordering(i);
		if (game_list.length != 0) {
			span.classList.add("game_span");
		}

		span.appendChild(create_label(i));

		create_rank_point_list(i, game_list, worse_ordering).forEach(
			rank_point => span.appendChild(rank_point)
		);

		create_connect_list(i, worse_ordering).forEach(
			connect => span.appendChild(connect)
		);
		
		let tooltip = create_tooltip(i, game_list);
		if (tooltip != undefined) {
			span.appendChild(tooltip);
		}

		graph.appendChild(span);
	}

	graph.style.display = "block";
	graph.scrollTo(INFINITE, 0);
}

create_rank_graph();

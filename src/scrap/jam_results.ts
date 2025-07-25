import { fetch_or_refetch } from "../share/fetch.ts";
import {
	index_of_or_crash,
	get_start_end_pos_from_tags
} from "../share/html.ts";

let GAME_LIST_TAG = '<div class="game_ranking responsive_column">';
let GAME_TAG = '<div class="game_rank';

// the properties prefixed with `recalc__` are unused. this is because
// uml will recalculate all these unused datas from the datas it already
// have. for example, recalc__num_entries is unused because the number of
// entries will be recalculated from the size of the jam list array anyway
//
// these data are kept because I felt like so
type Metadata = {
	num_pages: number;

	recalc__num_entries: number;
	recalc__num_entries_rated: number;
	recalc__num_ratings: number;

	jam_start_at: number;
	jam_end_at: number;
	voting_start_at: number;
	voting_end_at: number;

	rating_avg: number;
	median: number;
};

export type Game = {
	link: string;
	score: number;

	recalc__rank: number;
};

export type JamResults = {
	metadata: Metadata;
	game_rated_list: Game[];
};

async function fetch_html(path: string): Promise<string> {
	let res = await fetch_or_refetch(path);
	let html = await res.text();
	return html;
}

function rm_st_nd_rd_th(s: string): string {
	return s.replaceAll("st", "").replaceAll("nd", "")
	        .replaceAll("rd", "").replaceAll("th", "");
}

function get_game(html: string, cursor: number): Game {
	let game_summary_start
		= index_of_or_crash(html, '<div class="game_summary">', cursor);

	let [link_start, link_end] = get_start_end_pos_from_tags(
		html, '<a href="', '"', game_summary_start
	);

	let [rank_start, rank_end] = get_start_end_pos_from_tags(
		html, '<strong class="ordinal_rank">', '</strong>', link_end
	);

	let H3_CLOSE_TAG = '</h3>';
	let end_of_rank_h3 = index_of_or_crash(html, H3_CLOSE_TAG, rank_end);

	let SCORE_TAG = '(Score: ';
	let score_start = html.indexOf(SCORE_TAG, rank_end) + SCORE_TAG.length;
	let score_end = html.indexOf(')', score_start);

	if (score_start >= end_of_rank_h3 || score_end >= end_of_rank_h3) {
		console.log("invalid score_start or score_end");
		Deno.exit();
	}

	return {
		link: html.substring(link_start, link_end),
		score: score_start == SCORE_TAG.length - 1 ? 0 : Number(
			html.substring(score_start, score_end).replaceAll(",", "")
		),
		recalc__rank: Number(rm_st_nd_rd_th(
			html.substring(rank_start, rank_end).replaceAll(",", "")
		)),
	};
}

function get_game_list(html: string): Game[] {
	let cursor = index_of_or_crash(html, GAME_LIST_TAG, 0);

	let game_list: Game[] = [];

	while (true) {
		cursor = html.indexOf(GAME_TAG, cursor + 1);
		if (cursor == -1) {
			break;
		}

		game_list.push(get_game(html, cursor));
	}

	return game_list;
}

function get_date(s: string, search_start_index: number): [number, number] {
	let span_start = index_of_or_crash(s, '<span ', search_start_index);

	return get_start_end_pos_from_tags(
		s,
		'>',
		'</span>',
		span_start
	);
}

function get_metadata(html: string): Metadata {
	let PAGER_LABEL_TAG   = '<span class="pager_label">';
	let pager_label_start = html.indexOf(PAGER_LABEL_TAG)
	                      + PAGER_LABEL_TAG.length;

	let NUM_PAGE_TAG    = '<a href="?page=';
	let num_pages_start = html.indexOf(NUM_PAGE_TAG, pager_label_start)
	                    + NUM_PAGE_TAG.length;
	let num_pages_end   = html.indexOf('">', num_pages_start);


	let SUMMARY_DIV_TAG
		= '<div class="jam_summary"><div class="responsive_column">';
	let summary_div_start = index_of_or_crash(html, SUMMARY_DIV_TAG, 0)
	                      + SUMMARY_DIV_TAG.length;

	let [summary_start, summary_end] = get_start_end_pos_from_tags(
		html,
		'<p>',
		'</p></div>',
		summary_div_start
	);

	let summary = html.substring(summary_start, summary_end);


	let [num_entries_start, num_entries_end] = get_start_end_pos_from_tags(
		summary, '<strong>', ' entries</strong>', 0
	);

	let [jam_start__start, jam_start__end] = get_date(summary, num_entries_end);
	let [jam_end__start, jam_end__end] = get_date(summary, jam_start__end);

	let [num_ratings_start, num_ratings_end] = get_start_end_pos_from_tags(
		summary, '<strong>', ' ratings</strong>', jam_end__end
	);

	let [
		num_entries_rated_start,
		num_entries_rated_end
	] = get_start_end_pos_from_tags(
		summary,
		'<strong>',
		' entries</strong>',
		num_ratings_end
	);

	let [voting_start__start, voting_start__end] = get_date(
		summary, num_entries_rated_end
	);

	let [voting_end__start, voting_end__end] = get_date(
		summary, voting_start__end
	);

	let [rating_avg_start, rating_avg_end] = get_start_end_pos_from_tags(
		summary, '<strong>', '</strong>', voting_end__end
	);

	let [median_start, median_end] = get_start_end_pos_from_tags(
		summary, '<strong>', '</strong>', rating_avg_end
	);

	return {
		num_pages: pager_label_start == PAGER_LABEL_TAG.length - 1 ? 1
			: Number(html.substring(num_pages_start, num_pages_end)),

		recalc__num_entries: Number(summary.substring(
			num_entries_start, num_entries_end
		).replaceAll(",", "")),
		recalc__num_entries_rated: Number(summary.substring(
			num_entries_rated_start, num_entries_rated_end
		).replaceAll(",", "")),
		recalc__num_ratings: Number(summary.substring(
			num_ratings_start, num_ratings_end
		).replaceAll(",", "")),

		jam_start_at: Date.parse(summary.substring(
			jam_start__start, jam_start__end
		) + " UTC"),
		jam_end_at: Date.parse(summary.substring(
			jam_end__start, jam_end__end
		) + " UTC"),
		voting_start_at: Date.parse(summary.substring(
			voting_start__start, voting_start__end
		) + " UTC"),
		voting_end_at: Date.parse(summary.substring(
			voting_end__start, voting_end__end
		) + " UTC"),

		rating_avg: Number(summary.substring(
			rating_avg_start, rating_avg_end
		).replaceAll(",", "")),
		median: Number(summary.substring(
			median_start, median_end
		).replaceAll(",", "")),
	};
}

export async function get_jam_results(path: string): Promise<JamResults> {
	let html = await fetch_html(path);
	html = html.replaceAll("\r", "");

	return {
		metadata: get_metadata(html),
		game_rated_list: get_game_list(html),
	};
}

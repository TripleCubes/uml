export type Author = {
	name: string;
	link: string;
};

export type Game = {
	name: string;
	link: string;
	id: number;
	num_ratings: number;
	score: number;
	submitted_at: number;
	author_list: Author[];
};

export type Jam = {
	ordering: number;
	is_majorjam: boolean;
	name: string;
	mj_id: number;
	link: string;
	jam_end_at: number;
	game_list: Game[];
};

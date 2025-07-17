import { INFINITE } from "../share/consts.ts";

export function get_max_rank_from_rank_type(rank_type: string): number {
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

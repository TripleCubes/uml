export let ILSCORE_HINT
	= "ilscore = (25 * log10(num_of_games_in_jam+1)^2) * (score/5)";

export function get_ilscore(score: number, num_games_in_jam: number): number {
	return (25 * Math.log10(num_games_in_jam + 1) ** 2)
	     * (score / 5);
}

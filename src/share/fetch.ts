let DEFAULT_FETCH_WAIT = 6;

function wait(time_sec: number): Promise<void> {
	return new Promise(
		(resolve) => { setTimeout(resolve, time_sec * 1000); }
	);
}

function is_int(s: string): boolean {
	for (let i = 0; i < s.length; i++) {
		let c = s[i];
		if (c < "0" || c > "9") {
			return false;
		}
	}

	return true;
}

async function fetch_wait(): Promise<void> {
	let wait_time = DEFAULT_FETCH_WAIT;

	if (Deno.args.length != 0) {
		if (Deno.args.length == 1) {
			if (!is_int(Deno.args[0])) {
				console.log("invalid arg");
				Deno.exit();
			}

			wait_time = Number(Deno.args[0]);
		}
		else {
			console.log("too many args");
			Deno.exit();
		}
	}

	await wait(wait_time);
}

export async function fetch_or_refetch(path: string): Promise<Response> {
	await fetch_wait();

	while (true) {
		let res = await fetch(path);
		console.log("[FETCHED]", res.status, res.statusText, path);

		if (res.status == 200) {
			return res;
		}
		else {
			await wait(DEFAULT_FETCH_WAIT);
		}
	}
}

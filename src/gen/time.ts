export function ms_to_str(msec: number): string {
	let sec = Math.floor(msec/1000)       % 60;
	let min = Math.floor(msec/1000/60)    % 60;
	let hr  = Math.floor(msec/1000/60/60) % 24;
	let day = Math.floor(msec/1000/60/60/24);

	let day_str = "";
	if (day != 0) {
		day_str = day.toString() + "d ";
	}

	let hr_str = "";
	if (hr != 0 || day != 0) {
		hr_str = hr.toString() + "h ";
	}

	let min_str = "";
	if (min != 0 && day == 0) {
		min_str = min.toString() + "m ";
	}

	let sec_str = "";
	if (day == 0 && hr == 0) {
		sec_str = sec.toString() + "s ";
	}

	return day_str + hr_str + min_str + sec_str;
}

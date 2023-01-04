export function is_there_any_conflict({ start, end, items }) {
	//what it does : it checks whether there is any conflicts between that range and any of those items or not
	//items is an array of items that contain start_date and end_date (both are unix timestamps)
	//range is an object of 2 unix timestamps : {start : number,end : number}
	//todo instead of working on items, deep clone it first and work on that becuse may that change while filtering
	return (
		/* todo make sure about this function 
		(conflict_situations are completely tested) */
		/* note if end of one task or event is equal to 
		start of the next one we do not consider it as a conflict 
		(todo make sure this rule is respected everywhere)*/
		items.filter((item) => {
			var item_start = item.start_date;
			var item_end = item.end_date;
			var possible_conflicts = [
				/* 	these are situations that if an
					item has we undertand that it has
					conflict with that range
					first item of each of these is related to start_date of item
					and second item is related to end_date of item
					so ["before", "in"] means start_date of item is smaller than start of range
					and also that "in" means (range_start < end_date < range_end) 

					** help understanding :
					each range is imagined like this : before---start---in---end---after
				  	and each item_start or item_end is either in one of these 5 places
				*/
				{
					situation: ["before", "in"],
					bool: item_start < start && start < item_end && item_end < end,
				},
				{ situation: ["before", "end"], bool: item_start < start && item_end === end },
				{ situation: ["before", "after"], bool: item_start < start && item_end > end },
				{
					situation: ["start", "in"],
					bool: item_start === start && start < item_end && item_end < end,
				},
				{ situation: ["start", "end"], bool: item_start === start && item_end === end },
				{ situation: ["start", "after"], bool: item_start === start && item_end > end },
				{
					situation: ["in", "in"],
					bool:
						start < item_start &&
						item_start < end &&
						start < item_end &&
						item_end < end,
				},
				{
					situation: ["in", "end"],
					bool: start < item_start && item_start < end && item_end === end,
				},
				{
					situation: ["in", "after"],
					bool: start < item_start && item_start < end && item_end > end,
				},
			];
			var conflicts = possible_conflicts.filter((i) => i.bool);
			if (conflicts.length !== 0) {
				//console.log(JSON.stringify({ item, situation: conflicts.map(i => i.situation) }))
				return true;
			} else {
				return false;
			}
		}).length !== 0
	);
}

export function gen_verification_code() {
	return Math.floor(100000 + Math.random() * 900000);
}

export function toHHMMSS(seconds) {
	var sec_num = parseInt(seconds, 10);
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - hours * 3600) / 60);
	var seconds = sec_num - hours * 3600 - minutes * 60;

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return {
		hours,
		minutes,
		seconds,
	};
}
export function trim_text_if_its_long(string, max_length) {
	var tmp = string.split("");
	if (tmp.length > max_length) {
		var tmp2 = tmp.slice(0, max_length);
		tmp2.push("...");
		return tmp2.join("");
	} else {
		return tmp.join("");
	}
}
export function clone_simple_object(object_to_clone) {
	/* as it's obvious from it's name just use this 
	func for objects like {a:"hamed",b:"negin"} */
	var cloned_object = {};
	Object.keys(object_to_clone).forEach((key) => {
		cloned_object[key] = object_to_clone[key];
	});
	return cloned_object;
}
export function multi_lang_helper({ en, fa }) {
	var lang = window.localStorage.getItem("language");
	if (lang === null) {
		return fa; //defalt lang is set here
		//todo get default lang from user in the first setup page
	}
	return lang === "fa" ? fa : en;
}

//todo do detecting if access is denied or not server side
export function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}
export function gen_link_to_file(relative_file_path) {
	/* we serve ./uploaded directory on same port as api 
		but when frontend wants to access an image the link 
		it should use depends on where its running in 
		for example if the frontend is in the same machine with api 
		it should connect to localhost but if its on a network it should
		connect to machine which api is running on using its local or public ip
	*/
	// relative_file_path is relative with ./uploaded directory
	return new URL(relative_file_path, window.api_endpoint).href;
}
export function setCookie(name, value, days) {
	//it doesnt overwrite the other current cookies
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
export function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
export function eraseCookie(name) {
	document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
export function custom_range({ from = 0, to }) {
	var result = [];
	for (let i = from; i <= to; i++) {
		result.push(i);
	}
	return result;
}
export function get_start_and_end(timestamp, mode = "day") {
	//timestamp := result of Date.getTime()
	//what mode does : if mode = day it will smaller details than day like hours and minutes and ...
	//but if its set to year it will return the exact start point of that year
	var d = new Date(timestamp);
	d.setUTCHours(0);
	d.setUTCMinutes(0);
	d.setUTCSeconds(0);
	if (mode === "month") {
		d.setUTCDate(1);
		if (mode === "year") {
			d.setUTCMonth(0);
		}
	}
	d = d.getTime();
	return {
		start: d,
		end: d + 3600 * 1000 * 24,
	};
}
export var month_names = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
].map((i) => i.toLowerCase());
export var day_names = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
].map((i) => i.toLowerCase());

export function get_months_days_count(year) {
	return [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
}
export function timestamp_filled_range({ start, end, items}) {
	let result = [
		...items.map((i) => {
			return { ...i };
		}),
	];
	result = result
		.sort((i1, i2) => i1.start_date - i2.start_date)
		.filter((i) => is_there_any_conflict({ items: [i], start, end }));
	if (result.length === 0) {
		result = [{ value: null, start_date: start, end_date: end ,start_percent : 0,end_percent : 100}]
		return result;
	}
	if (result[0].start_date !== start) {
		if (result[0].start_date < start) {
			result[0].start_date = start;
		} else {
			result.unshift({ value: null, start_date: start, end_date: result[0].start_date });
		}
	}
	if (result[result.length - 1].end_date !== end) {
		if (result[result.length - 1].end_date > end) {
			result[result.length - 1].end_date = end;
		} else {
			result.push({
				value: null,
				start_date: result[result.length - 1].end_date,
				end_date: end,
			});
		}
	}
	while (true) {
		let index_to_fill = null;
		for (let i = 1; i <= result.length - 1; i++) {
			if (result[i - 1].end_date !== result[i].start_date) {
				index_to_fill = i;
				break;
			}
		}
		if (index_to_fill === null) {
			break;
		} else {
			result.splice(index_to_fill, 0, {
				value: null,
				start_date: result[index_to_fill - 1].end_date,
				end_date: result[index_to_fill].start_date,
			});
		}
	}
	//adding percents for start and end dates
	result = result.map((item) => {
		return {
			...item,
			start_percent: ((item.start_date - start) / (end - start)) * 100,
			end_percent: ((item.end_date - start) / (end - start)) * 100,
		};
	});
	return result;
}
export function sum_array(array){
	var total = 0;
	array.forEach(number => {
		total += number
	})
	return total
}
export var check_being_collaborator = (item, user_id) =>
	item.collaborators.map((collaborator) => collaborator.user_id).includes(user_id);

export var unique_items_of_array = (
	array // it may not work for array containing anything other than numbers or string
) => array.filter((i, index) => array.indexOf(i) === index);

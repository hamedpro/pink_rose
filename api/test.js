import { timestamp_filled_range } from "../src/frontend_helpers.js";
import { is_there_any_conflict } from "../common_helpers.cjs";
console.log(is_there_any_conflict({items : [],start : 2, end :3 }))
var items = [
	{
		start_date: 3,
		end_date: 5,
	},
    {
        start_date: 5,
        end_date : 6
    }
];
var s = timestamp_filled_range({ start: 4, end: 6, items })
console.log(s)
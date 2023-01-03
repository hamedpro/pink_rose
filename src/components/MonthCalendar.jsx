import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { get_tasks } from "../../api/client";
import { custom_range } from "../../common_helpers.js";
import "./MonthCalendarStyles.css";
import { month_names, day_names ,get_months_days_count} from "../../common_helpers.js";
export const MonthCalendar = ({ }) => {
	var nav = useNavigate()
	var [query_params,set_query_params] = useSearchParams()
	var { user_id } = useParams();
	var [tasks, set_tasks] = useState(null);
	async function get_data() {
		set_tasks(
			await get_tasks({
				filters: {
					_id: user_id,
				},
			})
		);
	}
	useEffect(() => {
		get_data;
	}, []);
	var dev_mode = false;
	
	var [selected_month, select_month] = useState(query_params.get('default') !== null ? query_params.get('default').split('-')[1] : month_names[new Date().getMonth()]);
	var [selected_year, select_year] = useState(query_params.get('default') !== null ? Number(query_params.get('default').split('-')[0]) :new Date().getFullYear());
	function get_month_number(month_name) {
		return month_names.indexOf(month_name) + 1;
	}

	function gen_start_and_end(year, month_name) {
		var months_days_count = get_months_days_count(year);
		var start = new Date(year, get_month_number(month_name) - 1, 1).getTime();
		var end = start + months_days_count[get_month_number(month_name) - 1] * 24 * 3600 * 1000;
		return { end, start };
	}
	var filter_times = gen_start_and_end(selected_year, selected_month);
	var filtered_tasks =
		tasks !== null
			? tasks.filter(
					(task) =>
						task.start_date > filter_times.start && task.end_date < filter_times.end
			  )
			: null;
	function calc_calnedar_parts() {
		/* 
            this function will calc how many rows with 
            7 columns are required to show all days 
            of the selected month and the exact position 
            of each day in each row 
        */
		/* it's default is to start the week from sunday  */
		var selected_month_number = get_month_number(selected_month);
		var index_of_first_day_of_the_selected_month = new Date(
			selected_year,
			selected_month_number - 1,
			1
		).getDay();
		var result = [[]];
		var tmp = custom_range({
			from: 1,
			to: get_months_days_count(selected_year)[get_month_number(selected_month) - 1],
		});
		var starting_null_items_count = index_of_first_day_of_the_selected_month;
		for (let i = 0; i < starting_null_items_count; i++) {
			result[result.length - 1].push(null);
		}
		while (tmp.length !== 0) {
			if (result[result.length - 1].length !== 7) {
				result[result.length - 1].push(tmp[0]);
				tmp.shift();
			} else {
				result.push([]);
				result[result.length - 1].push(tmp[0]);
				tmp.shift();
			}
		}
		while (result[result.length - 1].length !== 7) {
			result[result.length - 1].push(null);
		}
		return result;
	}
	//take care if becuse of setState being async we can not use its value right there in component function body (may selected_month be undefined there)

	return (
		<div className="p-2">
			<h1>MonthCalendar</h1>
			<select
				onChange={(e) => {
					select_month(e.target.value);
				}}
				value={selected_month}
				className="px-2"
			>
				{month_names.map((month_name, index) => {
					return (
						<option key={index} value={month_name}>
							{month_name}
						</option>
					);
				})}
			</select>
			<span className="mx-3">of</span>
			<input
				type="number"
				onChange={(e) => select_year(Number(e.target.value))}
				value={selected_year}
				className="inline-block px-2"
			/>
			<div className={["border border-red-400", dev_mode ? "" : "hidden"].join(" ")}>
				selected month = {selected_month}
				<br />
				filter times : {JSON.stringify(filter_times)}
				<br />
				tasks of the selected month : {JSON.stringify(filtered_tasks)}
				<br />
				name of the first day of the selected month ({selected_month}) :{" "}
				{day_names[calc_calnedar_parts()]}
				<br />
				result of calc_calnedar_parts function : {JSON.stringify(calc_calnedar_parts())}
			</div>

			<table className="month_calendar my-2">
				<tbody>
					<tr className="headers">
						<th>sunday</th>
						<th>monday</th>
						<th>tuesday</th>
						<th>wednesday</th>
						<th>thursday</th>
						<th>friday</th>
						<th>saturday</th>
					</tr>
					{calc_calnedar_parts().map((calendar_part, index) => {
						return (
							<tr key={index}>
								{calendar_part.map((day, index2) => {
									return <td className="cursor-pointer" key={index2} onClick={() => {
										if (day === null) return 
										nav(`/users/${user_id}/calendar/day?default=${selected_year}-${selected_month}-${day}`)
									} }>{day !== null ? day : "-"}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

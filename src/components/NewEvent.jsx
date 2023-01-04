import React, { useState } from "react";
import { new_event } from "../../api/client";
import { TextField } from "@mui/material";
//import AdapterMoment from "@date-io/jalaali";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useEffect } from "react";
import {
	get_calendar_categories,
	new_calendar_category,
} from "../../api/client";
import Select from "react-select";
export const NewEvent = () => {
	var user_id = localStorage.getItem("user_id");
	async function get_data() {
		set_calendar_categories(await get_calendar_categories({ user_id }));
	}
	var [selected_calendar_category, select_calendar_category] = useState(null);

	var submit_new_event = async () => {
		var result = await new_event({
			end_date: selected_dates.end,
			start_date: selected_dates.start,
			workflow_id,
			workspace_id,
			category_id: selected_calendar_category.value._id,
			...input_values,
			user_id,
		});
		if (result.has_error) {
			alert("Error! : " + result.error);
		} else {
			alert("done");
		}
	};
	var [input_values, set_input_values] = useState({
		title: null,
	});
	const [calendar_categories, set_calendar_categories] = useState(null);
	var [selected_dates, set_selected_dates] = useState({ end: null, start: null });
	useEffect(() => {
		get_data();
	}, []);
	if (calendar_categories === null) return <h1>still loading data ...</h1>;
	return (
		<div>
			<h1>NewEvent</h1>
			<input
				onChange={(event) => {
					set_input_values({ title: event.target.value });
				}}
			/>
			<h2>select an existing calendar category or create a new one</h2>
			<Select
				onChange={select_calendar_category}
				value={selected_calendar_category}
				options={[
					...calendar_categories.map((cat) => {
						return {
							value: cat,
							label: `${cat.name} (${cat.color})`,
						};
					}),
				]}
				isSearchable
			/>
			<h3>if what you want was not in existing categories create it first :</h3>
			<input id="new_calendar_category_name_input" />
			<p>
				and enter one of these colors here :
				"yellow","red","blue","darkblue","green","purple","black"
			</p>
			<input id="new_calendar_category_color_input" />
			<button
				onClick={async () => {
					await new_calendar_category({
						user_id,
						name: document.getElementById("new_calendar_category_name_input").value,
						color: document.getElementById("new_calendar_category_color_input").value,
					});
					alert(
						"new calendar category was added to your profile successfuly.above options will be updated. please select it"
					);
					get_data();
				}}
			>
				create a new category
			</button>
			<h2>select 'start' and 'end' dates for this task : </h2>
			{["start", "end"].map((type, index) => {
				return (
					<div key={index} className="mb-3 block">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								renderInput={(props) => <TextField {...props} />}
								label={`select task ${type} date`}
								value={selected_dates[type]}
								onChange={(newValue) => {
									set_selected_dates((prev_dates) => {
										var tmp = { ...prev_dates };
										tmp[type] = newValue.$d.getTime();
										return tmp;
									});
								}}
							/>
						</LocalizationProvider>
					</div>
				);
			})}
			<button onClick={submit_new_event}>submit this event</button>
		</div>
	);
};

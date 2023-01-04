import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { TextField } from "@mui/material";
//import AdapterMoment from "@date-io/jalaali";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
	custom_get_collection,
	get_calendar_categories,
	get_users,
	new_calendar_category,
	new_task,
} from "../../api/client";
import Select from "react-select";
//TODO: component re-renders
export const NewTask = () => {
	var nav = useNavigate();
	var [search_params, set_search_params] = useSearchParams();
	var workspace_id = search_params.get("workspace_id");
	var workflow_id = search_params.get("workflow_id");

	var user_id = localStorage.getItem("user_id");
	const [notes, setNotes] = useState(null);
	const [selectedNotes, selectNotes] = useState([]);
	const [title_input, set_title_input] = useState();
	const [calendar_categories, set_calendar_categories] = useState(null);
	//TODO: check _locale for possible option to output the _d(date) object in jalaali's format
	const [selected_dates, set_selected_dates] = useState({
		end: null,
		start: null,
	});
	var [all_users, set_all_users] = useState(null);

	async function get_data() {
		setNotes(await custom_get_collection({context : "notes",user_id}));
		set_calendar_categories(await get_calendar_categories({ user_id }));
		set_all_users(await get_users({ filters: {} }));
	}
	var [selected_collaborators, set_selected_collaborators] = useState([]);
	useEffect(() => {
		get_data();
	}, []);
	async function submit_new_task() {
		var collaborators = selected_collaborators.map((i) => {
			return { access_level: 1, user_id: i.value };
		});
		collaborators.push({ access_level: 3, user_id });
		try {
			var result = await new_task({
				workflow_id,
				end_date: selected_dates.end,
				start_date: selected_dates.start,
				linked_notes: selectedNotes.map((i) => i.value),
				workspace_id,
				title: title_input,
				category_id: selected_calendar_category.value._id,
				collaborators,
			});
			if (result.has_error) {
				alert("Error! : " + result.error);
			} else {
				var id_of_new_task = result;
				alert("all done. navigating to the newly created task's page");
				nav(`/dashboard/tasks/${id_of_new_task}`);
			}
		} catch (error) {
			console.log(error);
			alert("something went wrong. details in console");
		}
	}
	var [selected_calendar_category, select_calendar_category] = useState(null);
	if (all_users === null || notes === null || calendar_categories === null)
		return <h1>still loading data ...</h1>;
	return (
		<div className="p-2">
			<h1>NewTask</h1>
			<h1>creator's user_id : {user_id} </h1>
			<h1>workspace_id : {workspace_id} </h1>
			<h1>workflow_id : {workflow_id} </h1>
			<h2>enter a title for this task : </h2>
			<input onChange={(ev) => set_title_input(ev.target.value)} />
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
			<h2>select notes you want to link with this task :</h2>
			<Select
				onChange={selectNotes}
				options={notes.map((note) => {
					return {
						value: note._id,
						label: note.title,
					};
				})}
				isMulti
				isSearchable
				value={selectedNotes}
			/>
			<br />
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
			<h1>choose collaborators of this new workspace :</h1>
			<Select
				onChange={set_selected_collaborators}
				value={selected_collaborators}
				options={[
					...all_users.filter(user => user._id !== user_id).map((user) => {
						return {
							value: user._id,
							label: `@${user.username}`,
						};
					}),
				]}
				isMulti
				isSearchable
			/>
			<button onClick={submit_new_task}>submit</button>
		</div>
	);
};

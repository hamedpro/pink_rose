import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { custom_get_collection } from "../../api/client.js";
import { get_start_and_end } from "../../common_helpers.js";

export const WeekCalendar = () => {
	return <h1>this component needs development</h1>;
	var user_id = localStorage.getItem("user_id");
	var [searchParams, setSearchParams] = useSearchParams();
	var timestamp = searchParams.has("timestamp")
		? // the week will be considered from the start point of the first sunday before the timestamp until 7*24*3600*1000 milli seconds later
		  Number(searchParams.get("timestamp"))
		: new Date().getTime();
	var [filtered_tasks, set_filtered_tasks] = useState(null);
	var { start, end } = get_start_and_end(timestamp, "week");
	async function get_data() {
		var tasks = await custom_get_collection({
			context: "tasks",
			user_id,
		});
		set_filtered_tasks(tasks.filter((task) => task.start_date > start && task.end_date < end));
	}
	useEffect(() => {
		get_data();
	}, []);
	return (
		<>
			<div>YearCalendar</div>

			<p>task should be in this range below : </p>
			<p>
				start from ({start}) which its local presentation is ({new Date(start).toString()})
			</p>
			<p>
				until ({end}) which its local presentation is ({new Date(end).toString()})
			</p>
			<p>json stringified of filtered_tasks : {JSON.stringify(filtered_tasks)}</p>
		</>
	);
};

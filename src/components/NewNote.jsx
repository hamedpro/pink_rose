import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { get_users, new_note } from "../../api/client";
import Select from "react-select";
export const NewNote = () => {
	var nav = useNavigate();
	var [search_params, set_search_params] = useSearchParams();

	var workspace_id = search_params.get("workspace_id");
	var workflow_id = search_params.get("workflow_id");

	var user_id = localStorage.getItem("user_id");
	async function submit_new_note() {
		var collaborators = selected_collaborators.map((i) => {
			return { access_level: 1, user_id: i.value };
		});
		collaborators.push({ access_level: 3, user_id });
		try {
			var id_of_new_note = await new_note({
				workflow_id,
				title: document.getElementById("title").value,
				workspace_id,
				collaborators,
			});
			alert("all done. navigating to newly created note's page");
			nav(`/dashboard/notes/${id_of_new_note}`);
		} catch (error) {
			console.log(error);
			alert("something went wrong. details in console");
		}
	}
	var [all_users, set_all_users] = useState(null);
	async function get_data() {
		set_all_users(await get_users({ filters: {} }));
	}
	useEffect(() => {
		get_data();
	}, []);
	var [selected_collaborators, set_selected_collaborators] = useState([]);
	if (all_users === null) return <h1>loading users list... </h1>;

	return (
		<div>
			<h1>NewNote</h1>
			<h1>user_id of the creator : {user_id}</h1>
			<h1>workspace_id : {workspace_id}</h1>
			<h1>workflow_id : {workflow_id}</h1>
			<h1>enter a title : </h1>
			<input id="title" className="border border-blue-400" />
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
			<button onClick={submit_new_note}>submit this note</button>
		</div>
	);
};

import React, { useEffect, useState } from "react";
import { useMatch, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { get_users, upload_new_resources } from "../../api/client";
import Select from "react-select";
export const NewResource = () => {
	var nav = useNavigate();
	var [search_params, set_search_params] = useSearchParams();

	var workspace_id = search_params.get("workspace_id");
	var workflow_id = search_params.get("workflow_id");

	var user_id = localStorage.getItem("user_id");
	async function upload_files_handler() {
		if (document.getElementById("files_input").files.length === 0) {
			alert("you have not selected any file to upload.");
			return;
		}
		var collaborators = selected_collaborators.map((i) => {
			return { access_level: 1, user_id: i.value };
		});
		collaborators.push({ access_level: 3, user_id });
		try {
			var result = await upload_new_resources({
				input_element_id: "files_input",
				data: {
					workspace_id,
					workflow_id,
					collaborators,
				},
			});
			alert(
				`all done! ${
					result.length === 1
						? "navigating to this new uploaded resource ..."
						: "you have uploaded multiple files so you will be navigated to workflow of these new uploaded files..."
				}`
			);
			if (result.length === 1) {
				nav(`/dashboard/resources/${result[0]}`);
			} else {
				nav(`/dashboard/workflows/${workflow_id}`);
			}
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
		<>
			<div>NewResource</div>
			<p>upload files to : </p>
			<input type="file" multiple id="files_input" />
			<h1>choose collaborators of this new workspace :</h1>
			<Select
				onChange={set_selected_collaborators}
				value={selected_collaborators}
				options={[
					...all_users
						.filter((user) => user._id !== user_id)
						.map((user) => {
							return {
								value: user._id,
								label: `@${user.username}`,
							};
						}),
				]}
				isMulti
				isSearchable
			/>
			<button onClick={upload_files_handler}>submit these</button>
		</>
	);
};

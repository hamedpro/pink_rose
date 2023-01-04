import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	custom_delete,
	get_collection,
	get_workspace_workflows,
	leave_here,
	update_document,
} from "../../api/client.js";
import { GlobalDataContext } from "../GlobalDataContext.js";
import { CollaboratorsManagementBox } from "./CollaboratorsManagementBox.jsx";
import CommentsBox from "./CommentsBox.jsx";
import ObjectBox from "./ObjectBox.jsx";
import { Section } from "./section.jsx";
export const WorkspacePage = () => {
	var nav = useNavigate();
	var { global_data, get_global_data } = useContext(GlobalDataContext);
	var { workspace_id } = useParams();
	var user_id = localStorage.getItem("user_id");
	var workspace = global_data.all.workspaces.find((i) => i._id === workspace_id);
	if (workspace === undefined) return <h1>workspace you are looking for didn't exist</h1>;
	var workflows = global_data.all.workflows.filter((i) => i.workspace_id === workspace_id);
	if (!workspace.collaborators.map((i) => i.user_id).includes(user_id)) {
		return (
			<>
				<h1>you have not access to this workspace</h1>
				<p>(you are not a collaborator of it )</p>
			</>
		);
	}
	async function change_workspace_handler(type) {
		var tmp = window.prompt(`enter new workspace ${type}`);
		if (!tmp) {
			alert("you rejected input or your input was empty");
			return;
		}
		var update_set = {};
		update_set[type] = tmp;
		update_document({
			collection: "workspaces",
			update_filter: {
				_id: workspace_id,
			},
			update_set,
		})
			.then(
				() => alert("all done!"),
				(error) => {
					console.log(error);
					alert("something went wrong. error in console ");
				}
			)
			.finally(get_global_data);
	}
	function leave_here_handler() {
		if (workspace.collaborators.find((i) => i.user_id === user_id).access_level === 3) {
			alert(
				"you are owner of here. if you want to leave here you must upgrade another collaborator to owner (instead of yourself) first"
			);
			return;
		}
		leave_here({ user_id, context: "workspaces", context_id: workspace_id })
			.then(
				() => alert("all done!"),
				(error) => {
					console.log(error);
					alert("something went wrong. error in console ");
				}
			)
			.finally(get_global_data);
	}
	function delete_here_handler() {
		alert("this feature is completed but not available right now."); // todo think access levels in system of collaboration and write an specification for it
		return;
		if (!window.confirm("are you sure ?")) return;
		custom_delete({
			context: "workspaces",
			id: workspace_id,
		})
			.then(
				(i) => {
					alert("all done");
					nav(`/dashboard`);
				},
				(error) => {
					console.log(error);
					alert("something went wrong! details in console");
				}
			)
			.finally(get_global_data);
	}
	return (
		<div>
			<h2>WorkspacePage</h2>
			<ObjectBox object={workspace} />
			<Section title="options">
				<button onClick={() => change_workspace_handler("title")}>
					change title of this workspace
				</button>
				<br />
				<button onClick={() => change_workspace_handler("description")}>
					change description of this workspace
				</button>
				<br />
				<button onClick={leave_here_handler}>leave here</button>
				<br />
				<button onClick={delete_here_handler}>delete this workspace</button>
			</Section>
			<CollaboratorsManagementBox context="workspaces" id={workspace_id} />
			<p>workflows of this workspace :</p>
			{workflows.map((workflow, index) => (
				<React.Fragment key={index}>
					<ObjectBox object={workflow} link={`/dashboard/workflows/${workflow._id}`} />
				</React.Fragment>
			))}
			<CommentsBox user_id={user_id} />
		</div>
	);
};

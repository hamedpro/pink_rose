import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { custom_get_collection, get_tasks } from "../../api/client";
import { CollaboratorsManagementBox } from "./CollaboratorsManagementBox";
import CommentsBox from "./CommentsBox";
import ObjectBox from "./ObjectBox";
const Workflow = () => {
  var nav = useNavigate();
	var { workflow_id } = useParams();
	var user_id = localStorage.getItem("user_id");
	var [notes, set_notes] = useState(null);
	var [tasks, set_tasks] = useState(null);
	async function get_data() {
		try {
			var response = await custom_get_collection({context : "notes",user_id});
			set_notes(response.filter((note) => note.workflow_id === workflow_id));
			set_tasks(await get_tasks({ filters: { workflow_id } }));
		} catch (error) {
			console.log(error);
			alert("something went wrong. details in console");
		}
	}
	useEffect(() => {
		get_data();
	}, []);
	return (
		<div>
			<h1>Workflow page</h1>

			<CollaboratorsManagementBox context='workflows' id={ workflow_id} />
			{notes !== null && (
				<>
					<h1>notes : </h1>
					{notes.map((note, index) => {
						return (
							<React.Fragment key={index}>
								<ObjectBox object={note} link={`/dashboard/notes/${note._id}`} />
							</React.Fragment>
						);
					})}
				</>
			)}
			{tasks !== null && (
				<>
					<h1>tasks : </h1>
					{tasks.map((task, index) => {
						return (
							<React.Fragment key={index}>
								<ObjectBox object={task} link={`/dashboard/tasks/${task._id}`} />
							</React.Fragment>
						);
					})}
				</>
			)}
			<CommentsBox user_id={user_id} />
		</div>
	);
};

export default Workflow;

import { useContext, useEffect } from "react";
import { useState } from "react";
import { useMatch, useParams } from "react-router-dom";
import {
	get_comments,
	new_comment,
	edit_comment,
	delete_comment,
	get_workflows,
	get_resources,
	get_tasks,
	custom_get_collection,
} from "../../api/client";
import { GlobalDataContext } from "../GlobalDataContext";
import Comment from "./Comment";
const CommentSBox = ({ user_id }) => {
	var { global_data, get_global_data } = useContext(GlobalDataContext);
	var urlParams = useParams();
	var current_field = Object.keys(urlParams).find((i) => {
		return ["workspace_id", "workflow_id", "task_id", "resource_id", "note_id"].includes(i);
	});
	const [editId, setEditId] = useState("");
	const [inputComment, setInputComment] = useState("");
	var comments = global_data.all.comments.filter(
		(comment) =>
			comment.user_id === user_id && comment[current_field] === urlParams[current_field]
	);
	const inputCommentHandler = (e) => {
		setInputComment(e.target.value);
	};
	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await edit_comment({ new_text: inputComment, comment_id: editId });
				setEditId("");
				get_global_data();
			} else {
				var tmp = {
					date: new Date().getTime(),
					text: inputComment,
					user_id,
				};
				switch (current_field) {
					case "workspace_id":
						tmp.workspace_id = urlParams.workspace_id;
						break;
					case "workflow_id":
						var workflow = (
							await get_workflows({ filters: { _id: urlParams["workflow_id"] } })
						)[0];
						tmp["workflow_id"] = workflow._id;
						tmp["workspace_id"] = workflow.workspace_id;
						break;
					case "note_id":
						var note = (
							await custom_get_collection({ context: "notes", user_id })
						).find((i) => i._id === urlParams.note_id);
						tmp.workspace_id = note.workspace_id;
						tmp.workflow_id = note.workflow_id;
						tmp.note_id = note._id;
						break;
					case "resource_id":
						var resource = (
							await get_resources({ filters: { _id: urlParams["resource_id"] } })
						)[0];
						tmp.workspace_id = resource.workspace_id;
						tmp.workflow_id = resource.workflow_id;
						tmp.resource_id = resource._id;
						break;
					case "task_id":
						var task = (await get_tasks({ filters: { _id: urlParams["task_id"] } }))[0];
						tmp.workspace_id = task.workspace_id;
						tmp.workflow_id = task.workflow_id;
						tmp.task_id = task._id;
						break;
				}
				await new_comment(tmp);
				get_global_data();
			}
			setInputComment("");
		} catch (error) {
			console.log(error);
		}
	};

	const deleteHandler = (commentId) => {
		delete_comment({
			filters: {
				user_id,
				_id: commentId,
			},
		});
		get_global_data();
	};
	//TODO: what happens if client failed to fetch the comments.
	return (
		<div className="comments-box-container">
			{comments &&
				comments.map(({ _id, text }) => (
					<Comment
						key={_id}
						commentId={_id}
						text={text}
						setEditId={setEditId}
						deleteHandler={deleteHandler}
					/>
				))}
			<form onSubmit={submitHandler}>
				<input
					placeholder="enter a comment"
					value={inputComment}
					onChange={inputCommentHandler}
					required
				/>
				<button>{editId ? "edit message" : "send message"}</button>
			</form>
		</div>
	);
};

export default CommentSBox;

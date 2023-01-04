import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import { get_user_data_hierarchy } from "../../api/client";
function Option({ text,indent_count,url }) {
	var nav = useNavigate();
	var is_selected = useMatch(url)
	return (
		<div
			className={[
				"border-t border-b border-black flex  items-center w-full",
				is_selected ? "bg-blue-600 text-white" : "",
			].join(" ")}
			style={{ paddingLeft: (indent_count) * 20 + "px" }}
			onClick={()=>nav(url)}
		>
			{text}
		</div>
	);
}

export const PrimarySideBar = () => {
    var user_id = localStorage.getItem("user_id");
	var [options, set_options] = useState();
	var loc = useLocation();
	async function get_data() {
        var user_data_hierarchy = await get_user_data_hierarchy({ user_id });
        var tmp = []
        user_data_hierarchy.workspaces.forEach(ws => {
            tmp.push({
				text: `ws : ${ws.title}`,
				indent_count: 0,
				url: `/dashboard/workspaces/${ws._id}`,
			});
			ws.workflows.forEach((wf) => {
				tmp.push({
					text: `wf : ${wf.title}`,
					url: `/dashboard/workflows/${wf._id}`,
					indent_count: 1,
				});
				tmp.push({
					text: "notes",
					url: `/dashboard/workflows/${wf._id}`,
					indent_count: 2,
				});
				wf.notes.forEach((note) => {
					tmp.push({
						text: `note : ${note.title}`,
						url: `/dashboard/notes/${note._id}`,
						indent_count: 3,
					});
				});
				tmp.push({
					text: "new note",
					url: `/dashboard/notes/new?workspace_id=${ws._id}&workflow_id=${wf._id}`,
					indent_count: 3,
				});

				tmp.push({
					text: "tasks",
					url: `/dashboard/workflows/${wf._id}`,
					indent_count: 2,
				});
				wf.tasks.forEach((task) => {
					tmp.push({
						text: `task : ${task.title}`,
						url: `/dashboard/tasks/${task._id}`,
						indent_count: 3,
					});
				});
				tmp.push({
					text: "new task",
					url: `/dashboard/tasks/new?workspace_id=${ws._id}&workflow_id=${wf._id}`,
					indent_count: 3,
				});

				tmp.push({
					text: "resources",
					url: `/dashboard/workflows/${wf._id}`,
					indent_count: 2,
				});
				wf.resources.map((resource) => {
					tmp.push({
						text: `resource : ${resource._id}`,
						url: `/dashboard/resources/${resource._id}`,
						indent_count: 3,
					});
				});
				tmp.push({
					text: "new resource",
					url: `/dashboard/resources/new?workspace_id=${ws._id}&workflow_id=${wf._id}`,
					indent_count: 3,
				});
			});

			tmp.push({
				text: "new workflow",
				indent_count: 1,
				url: `/dashboard/workflows/new?workspace_id=${ws._id}`,
			});
        })
        tmp.push({
			text: "new workspace",
			url: `/dashboard/workspaces/new`,
			indent_count: 0,
		});
		set_options(tmp) // each option should contain all required props of Option component
	}
	useEffect(() => {
		get_data();
	}, [loc]);
	if (options == null) {
		return "loading options ...";
	}
	return (
		<>
            {options.map((option, index) => {
                return (
                    <Fragment key={index}>
                        <Option {...option} /> 
                    </Fragment>
                )
            })}
		</>
	);
};

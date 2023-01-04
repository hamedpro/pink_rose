import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_tasks } from "../../api/client";
import { CollaboratorsManagementBox } from "./CollaboratorsManagementBox";
import CommentsBox from "./CommentsBox";
import ObjectBox from "./ObjectBox";
export const Task = () => {
  var { task_id } = useParams();
  var user_id = localStorage.getItem("user_id");
  var [task, set_task] = useState(null);
  async function get_data() {
		var task = (
			await get_tasks({
				filters: {
					_id: task_id,
				},
			})
		)[0];
		set_task(task);
  }
  useEffect(() => {
		get_data();
  }, []);
  return (
		<div>
		  <h1>Task</h1>
		  <CollaboratorsManagementBox context={'tasks'} id={task_id } /> 
			{task !== null && <ObjectBox object={task} />}
			<CommentsBox user_id={user_id} />
		</div>
  );
};

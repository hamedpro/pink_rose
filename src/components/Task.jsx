import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_tasks } from "../../api/client";
import CommentsBox from "./CommentsBox";
import ObjectBox from "./ObjectBox";
export const Task = () => {
  var { task_id, workspace_id, workflow_id, user_id } = useParams();
  var [task, set_task] = useState(null);
  async function get_data() {
    var workflow_tasks = await get_tasks({
      filters: {
        workflow_id,
      },
    });
    set_task(workflow_tasks.find((task) => task._id == task_id));
  }
  useEffect(() => {
    get_data();
  }, []);
  return (
    <div>
      <h1>Task</h1>
      {task !== null && <ObjectBox object={task} />}
      <CommentsBox
        user_id={user_id}
        urlParams={useParams()}
      />
    </div>
  );
};

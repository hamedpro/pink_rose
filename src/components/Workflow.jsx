import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get_tasks, get_user_notes } from "../../api/client";
import CommentsBox from "./CommentsBox";
import ObjectBox from "./ObjectBox";
const Workflow = () => {
  var nav = useNavigate();
  var { workflow_id, user_id, workspace_id } = useParams();
  var [notes, set_notes] = useState(null);
  var [tasks, set_tasks] = useState(null);
  async function get_data() {
    try {
      var response = await get_user_notes({ creator_user_id: user_id });
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
      {notes !== null && (
        <>
          <h1>notes : </h1>
          {notes.map((note, index) => {
            return (
              <React.Fragment key={index}>
                <ObjectBox
                  object={note}
                  link={`/users/${user_id}/workspaces/${workspace_id}/workflows/${workflow_id}/notes/${note._id}`}
                />
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
                <ObjectBox
                  object={task}
                  link={`/users/${user_id}/workspaces/${workspace_id}/workflows/${workflow_id}/tasks/${task._id}`}
                />
              </React.Fragment>
            );
          })}
        </>
      )}
      <CommentsBox
        user_id={user_id}
        urlParams={useParams()}
      />
    </div>
  );
};

export default Workflow;

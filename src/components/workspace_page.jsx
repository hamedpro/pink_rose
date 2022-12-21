import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get_workspace_workflows } from "../../api/client.js";
import CommentsBox from "./CommentsBox.jsx";
import ObjectBox from "./ObjectBox.jsx";
export const WorkspacePage = () => {
  var nav = useNavigate();
  var { workspace_id, user_id } = useParams();
  var [workflows, set_workflows] = useState(null);
  async function get_data() {
    try {
      set_workflows(await get_workspace_workflows({ workspace_id }));
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
      <h2>WorkspacePage</h2>
      <p>workflows of this workspace :</p>
      {workflows !== null ? (
        workflows.map((workflow, index) => (
          <React.Fragment key={index}>
            <ObjectBox
              object={workflow}
              link={`/users/${user_id}/workspaces/${workspace_id}/workflows/${workflow._id}`}
            />
          </React.Fragment>
        ))
      ) : (
        <p>loading data ...</p>
      )}
      <CommentsBox
        user_id={user_id}
        urlParams={useParams()}
      />
    </div>
  );
};

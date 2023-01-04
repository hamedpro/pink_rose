import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { custom_get_collection, get_users } from "../../api/client";
import ObjectBox from "./ObjectBox";

const UserProfile = () => {
	var { user_id } = useParams();
	var [user, set_user] = useState(null);
	var [workspaces, set_workspaces] = useState(null);

	async function fetch_data() {
		try {
			var filtered_users = await get_users({
				filters: {
					_id: user_id,
				},
			});
			set_user(filtered_users[0]);
			set_workspaces(await custom_get_collection({context : "workspaces",user_id}));
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		fetch_data();
	}, []);
	return (
		<div className="p-2">
			<h1>UserProfile</h1>
			user data fetched by api :
			<br />
			<ObjectBox object={user} />
			{/* <h1>workspaces of this user</h1>
			{workspaces !== null &&
				workspaces.map((workspace, index) => {
					return (
						<React.Fragment key={index}>
							<ObjectBox
								object={workspace}
								link={`/users/${user_id}/workspaces/${workspace._id}`}
							/>
						</React.Fragment>
					);
				})
			} */}
			<p>
				click <Link to={`/dashboard/workspaces`}>here</Link> to open workspaces of this user
			</p>
		</div>
	);
};

export default UserProfile;

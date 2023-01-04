import React from "react";
import { Link } from "react-router-dom";

export const UserDashboard = () => {
	return (
		<div className="p-2">
			<p>-------- Quick access ------------</p>
			<div className="flex flex-col space-y-2">
				<Link to={`/login`}>login to account</Link>
				<Link to={`/register`}>register a new user</Link>
				<Link to={`/terms`}>our terms of use</Link>
				<Link to={`/subscribtion`}>subscribtion status</Link>
				<button onClick={() => window.localStorage.removeItem("user_id")}>logout</button>
			</div>
		</div>
	);
};

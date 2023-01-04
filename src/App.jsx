import React, { useState } from "react";
import "./App.css";
import "./output.css";
import { Routes, Route, useLocation, Link, useParams } from "react-router-dom";
import { month_names, multi_lang_helper as ml } from "../common_helpers.js";
import { Login } from "./components/Login";
import { RegisterPage } from "./components/register_page";
import { WorkspacePage } from "./components/workspace_page";
import { WorkspacesPage } from "./components/workspaces_page";
import { SubscribtionPage } from "./components/subscribtionPage";
import { UserDashboard } from "./components/UserDashboard";
import NewWorkspace from "./components/NewWorkspace";
import NewWorkflow from "./components/NewWorkflow";
import { Note } from "./components/Note";
import { Task } from "./components/Task";
import Workflow from "./components/Workflow";
import { NewNote } from "./components/NewNote";
import { NewTask } from "./components/NewTask";
import { Terms } from "./components/Terms";
import { VerifyIdentity } from "./components/VerifyIdentity";
import { MonthCalendar } from "./components/MonthCalendar.jsx";
import { DayCalendar } from "./components/DayCalendar";
import { Root } from "./components/Root.jsx";
import { PrimarySideBar } from "./components/PrimarySideBar";
import { NewResource } from "./components/NewResource";
import {
	CalendarMonthRounded,
	HomeOutlined,
	Notifications,
	Person2Outlined,
	Settings,
} from "@mui/icons-material";
import UserProfile from "./components/UserProfile";
import { UserSettings } from "./components/UserSettings";
import { NewEvent } from "./components/NewEvent";
import { Events } from "./components/Events";
import { Event } from "./components/Event";
import { Resource } from "./components/Resource";
import { useEffect } from "react";
import { custom_get_collection, get_collection } from "../api/client";
import { GlobalDataContext } from "./GlobalDataContext";
function TopBar() {
	var user_id = localStorage.getItem("user_id");
	return (
		<div
			className="w-full bg-blue-600 overflow-y-hidden flex items-center px-3 space-x-3"
			style={{ height: "8%" }}
		>
			<div className="w-1/5">
				<Link to={`/dashboard/settings`}>
					<Settings style={{ color: "white", width: "40px", height: "40px" }} />
				</Link>
				<Link to={`/users/${user_id}`}>
					<Person2Outlined style={{ color: "white", width: "40px", height: "40px" }} />
				</Link>
				<Link to={`/dashboard/`}>
					<HomeOutlined style={{ color: "white", width: "40px", height: "40px" }} />
				</Link>
			</div>
			<div className="w-4/5 flex justify-between items-center h-full ">
				<div className="h-full text-white flex items-center space-x-3">
					<CalendarMonthRounded />
					<div>
						{new Date().getUTCFullYear()} /{" "}
						<Link to={`/dashboard/calendar/month`}>
							{month_names[new Date().getMonth()]}
						</Link>{" "}
						/ {<Link to={`/dashboard/calendar/day`}>{new Date().getDate()}</Link>}
					</div>
				</div>
				<div className="flex items-center space-x-3 h-5/6 my-2 ">
					<Notifications style={{ color: "white", width: "40px", height: "40px" }} />
					<div className="px-2 rounded h-full flex justify-center items-center text-white bg-green-500 text-blue-900">
						subscribe
					</div>
				</div>
			</div>
		</div>
	);
}
function Wrapper() {
	return (
		<div className="h-full w-full border-black-900 flex-col">
			<TopBar />
			<div className="w-full flex" style={{ height: "92%" }}>
				<div className="w-1/5 bg-blue-500 overflow-y-auto h-full">
					<PrimarySideBar />
				</div>
				<div className="w-4/5 bg-blue-400 h-full overflow-y-auto h-9/10">
					<Routes>
						<Route path="" element={<WorkspacesPage key={new Date().getTime()} />} />
						<Route
							path="settings"
							element={<UserSettings key={new Date().getTime()} />}
						/>
						<Route
							path="verification"
							element={<VerifyIdentity key={new Date().getTime()} />}
						/>
						<Route
							path="workspaces"
							element={<WorkspacesPage key={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/new"
							element={<NewWorkspace key={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id"
							element={<WorkspacePage key={new Date().getTime()} />}
						/>
						<Route
							path="workflows/new"
							element={<NewWorkflow key={new Date().getTime()} />}
						/>
						<Route
							path="workflows/:workflow_id"
							element={<Workflow key={new Date().getTime()} />}
						/>
						<Route
							path="resources/new"
							element={<NewResource key={new Date().getTime()} />}
						/>
						<Route
							path="resources/:resource_id"
							element={<Resource key={new Date().getTime()} />}
						/>

						<Route path="notes/new" element={<NewNote key={new Date().getTime()} />} />
						<Route
							path="notes/:note_id"
							element={<Note key={new Date().getTime()} />}
						/>
						<Route path="tasks/new" element={<NewTask key={new Date().getTime()} />} />
						<Route
							path="tasks/:task_id"
							element={<Task key={new Date().getTime()} />}
						/>
						<Route path="events" element={<Events key={new Date().getTime()} />} />
						<Route
							path="events/new"
							element={<NewEvent key={new Date().getTime()} />}
						/>

						<Route
							path="events/:event_id"
							element={<Event key={new Date().getTime()} />}
						/>

						<Route path="calendar">
							<Route
								path="month"
								element={<MonthCalendar key={new Date().getTime()} />}
							/>

							{/* todo : test all calendar sub routes */}
							<Route
								path="day"
								element={<DayCalendar key={new Date().getTime()} />}
							/>
						</Route>
					</Routes>
				</div>
			</div>
		</div>
	);
}
function App() {
	var loc = useLocation();
	window.ml = ml;
	window.api_endpoint = API_ENDPOINT; // it gets replaced by vite
	var [global_data, set_global_data] = useState(null);
	async function get_global_data() {
		var user_id = localStorage.getItem("user_id");
		var new_user_context_state = { user: {}, all: {} };
		var tmp = ["workspaces", "workflows", "notes", "resources", "tasks"];
		for (var i = 0; i < tmp.length; i++) {
			new_user_context_state.all[tmp[i]] = await get_collection({
				collection_name: tmp[i],
				filters: {},
			});
			new_user_context_state.user[tmp[i]] =
				user_id !== null ? await custom_get_collection({ context: tmp[i], user_id }) : null;
		}

		var tmp = ["events", "calendar_categories", "comments"];
		for (var i = 0; i < tmp.length; i++) {
			new_user_context_state.user[tmp[i]] =
				user_id !== null
					? await get_collection({
							collection_name: tmp[i],
							filters: { user_id },
					  })
					: null;
			new_user_context_state.all[tmp[i]] = await get_collection({
				collection_name: tmp[i],
				filters: {},
			});
		}
		new_user_context_state.all.users = await get_collection({
			collection_name: "users",
			filters: {},
		});
		set_global_data(new_user_context_state);
	}
	useEffect(() => {
		get_global_data();
	}, [loc]);
	if (global_data === null) return <h1>loading data ...</h1>;
	return (
		<GlobalDataContext.Provider value={{ global_data, get_global_data }}>
			<Routes>
				<Route path="/" element={<Root key={new Date().getTime()} />} />
				<Route path="/login" element={<Login key={new Date().getTime()} />} />
				<Route path="/register" element={<RegisterPage key={new Date().getTime()} />} />
				<Route path="/terms" element={<Terms key={new Date().getTime()} />} />
				<Route
					path="/subscribtion"
					element={<SubscribtionPage key={new Date().getTime()} />}
				/>

				<Route
					path="/users/:user_id"
					element={<UserProfile key={new Date().getTime()} />}
				/>
				<Route path="/dashboard/*" element={<Wrapper key={new Date().getTime()} />}></Route>
			</Routes>
		</GlobalDataContext.Provider>
	);
}

export default App;

import React from "react";
import "./App.css";
import "./output.css";
import { Routes, Route, useLocation, Link, useParams } from "react-router-dom";
//import {} from "./components";
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
import { WeekCalendar } from "./components/WeekCalendar";
import { DayCalendar } from "./components/DayCalendar";
import { Root } from "./components/Root.jsx";
import { PrimarySideBar } from "./components/PrimarySideBar";
import { NewResource } from "./components/NewResource";
import { Resources } from "./components/Resources";
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
function TopBar() {
	var { user_id } = useParams();
	return (
		<div
			className="w-full bg-blue-600 overflow-y-hidden flex items-center px-3 space-x-3"
			style={{ height: "8%" }}
		>
			<div className="w-1/5">
				<Link to={`/users/${user_id}/settings`}>
					<Settings style={{ color: "white", width: "40px", height: "40px" }} />
				</Link>
				<Link to={`/users/${user_id}/profile`}>
					<Person2Outlined style={{ color: "white", width: "40px", height: "40px" }} />
				</Link>
				<Link to={`/users/${user_id}/`}>
					<HomeOutlined style={{ color: "white", width: "40px", height: "40px" }} />
				</Link>
			</div>
			<div className="w-4/5 flex justify-between items-center h-full ">
				<div className="h-full text-white flex items-center space-x-3">
					<CalendarMonthRounded />
					<div>
						{new Date().getUTCFullYear()} /{" "}
						<Link to={`/users/${user_id}/calendar/month`}>
							{month_names[new Date().getMonth()]}
						</Link>{" "}
						/{" "}
						{<Link to={`/users/${user_id}/calendar/day`}>{new Date().getDate()}</Link>}
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
						<Route
							path=""
							element={<UserDashboard timestamp={new Date().getTime()} />}
						/>

						<Route
							path="profile"
							element={<UserProfile timestamp={new Date().getTime()} />}
						/>

						<Route
							path="settings"
							element={<UserSettings timestamp={new Date().getTime()} />}
						/>

						<Route
							path="verification"
							element={<VerifyIdentity timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces"
							element={<WorkspacesPage timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/new"
							element={<NewWorkspace timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id"
							element={<WorkspacePage timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id/workflows/new"
							element={<NewWorkflow timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id/workflows/:workflow_id"
							element={<Workflow timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id/workflows/:workflow_id/resources/new"
							element={<NewResource timestamp={new Date().getTime()} />}
						/>

						<Route
							path="workspaces/:workspace_id/workflows/:workflow_id/resources"
							element={<Resources timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id/resources/new"
							element={<NewResource timestamp={new Date().getTime()} />}
						/>

						<Route
							path="workspaces/:workspace_id/resources"
							element={<Resources timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id/workflows/:workflow_id/notes/new"
							element={<NewNote timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id/workflows/:workflow_id/notes/:note_id"
							element={<Note timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id/workflows/:workflow_id/tasks/new"
							element={<NewTask timestamp={new Date().getTime()} />}
						/>
						<Route
							path="workspaces/:workspace_id/workflows/:workflow_id/tasks/:task_id"
							element={<Task timestamp={new Date().getTime()} />}
						/>
						<Route path="calendar">
							<Route
								path="month"
								element={<MonthCalendar timestamp={new Date().getTime()} />}
							/>
							<Route
								path="events"
								element={<Events timestamp={new Date().getTime()} />}
							/>
							<Route
								path="events/new"
								element={<NewEvent timestamp={new Date().getTime()} />}
							/>
							<Route
								path="events/:event_id"
								element={<Event timestamp={new Date().getTime()} />}
							/>
							{/* todo : test all calendar sub routes */}
							<Route
								path="week"
								element={<WeekCalendar timestamp={new Date().getTime()} />}
							/>
							<Route
								path="day"
								element={<DayCalendar timestamp={new Date().getTime()} />}
							/>
						</Route>
					</Routes>
				</div>
			</div>
		</div>
	);
}
function App() {
	window.ml = ml;
	window.api_endpoint = API_ENDPOINT; // it gets replaced by vite
	var loc = useLocation();
	return (
		<Routes>
			<Route path="/" element={<Root timestamp={new Date().getTime()} />} />
			<Route path="/login" element={<Login timestamp={new Date().getTime()} />} />
			<Route path="/register" element={<RegisterPage timestamp={new Date().getTime()} />} />
			<Route path="/terms" element={<Terms timestamp={new Date().getTime()} />} />
			<Route
				path="subscribtion"
				element={<SubscribtionPage timestamp={new Date().getTime()} />}
			/>
			<Route
				path="/users/:user_id/*"
				element={<Wrapper timestamp={new Date().getTime()} />}
			></Route>
		</Routes>
	);
}

export default App;

import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { get_calendar_categories, get_tasks, get_user_events } from "../../api/client";
import ObjectBox from "./ObjectBox";
import { month_names, timestamp_filled_range } from "../../common_helpers.js";
import { Section } from "./Section";
import { is_there_any_conflict } from "../../common_helpers.js";
export const DayCalendar = () => {
	var nav = useNavigate()
	var { user_id } = useParams();
	var [day_tasks, set_day_tasks] = useState(null);
	var [day_events, set_day_events] = useState(null);
	var [calendar_categories, set_calendar_categories] = useState(null);
	var [searchParams, setSearchParams] = useSearchParams();
	var tmp = searchParams.get("default");
	if (tmp !== null) {
		var year = Number(tmp.split("-")[0]);
		var month = month_names.indexOf(tmp.split("-")[1]) + 1;
		var day = Number(tmp.split("-")[2]);
	} else {
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		var day = d.getDate();
	}

	var start_timestamp = new Date(year, month - 1, day).getTime();
	var end_timestamp = start_timestamp + 3600 * 1000 * 24;
	async function get_data() {
		var tasks = await get_tasks({
			filters: {
				creator_user_id: user_id,
			},
		});
		var events = await get_user_events({ user_id });
		set_day_tasks(
			tasks
				.filter((task) =>
					is_there_any_conflict({
						start: start_timestamp,
						end: end_timestamp,
						items: [task],
					})
				)
				.map((i) => {
					return {
						...i,
						human_readble_start_date: new Date(i.start_date).toString(),
						human_readble_end_date: new Date(i.end_date).toString(),
					};
				})
		);
		set_day_events(
			events
				.filter((event) =>
					is_there_any_conflict({
						start: start_timestamp,
						end: end_timestamp,
						items: [event],
					})
				)
				.map((i) => {
					return {
						...i,
						human_readble_start_date: new Date(i.start_date).toString(),
						human_readble_end_date: new Date(i.end_date).toString(),
					};
				})
		);
		set_calendar_categories(await get_calendar_categories({ user_id }));
	}
	function open_item_page(item) {
		if (item.value === null) {
			alert('there is not any task or event where you clicked')
			return 
		}
		if (item.type_label === "tasks") {
			nav(`/users/${item.creator_user_id}/workspaces/${item.workspace_id}/workflows/${item.workflow_id}/tasks/${item._id}`)
		} else if (item.type_label) {
			nav(`/users/${item.creator_user_id}/calendar/events/${item._id}`)
		}
	}
	useEffect(() => {
		get_data();
	}, []);
	if (calendar_categories === null || day_events === null || day_tasks === null)
		return <h1>loading data ...</h1>;
	return (
		<>
			<div className="p-2">
				<div>DayCalendar</div>
				<p>
					showing from {start_timestamp} : {new Date(start_timestamp).toDateString()}
				</p>
				<p>
					to {end_timestamp} : {new Date(end_timestamp).toDateString()}
				</p>
				<Section title="day tasks">
					tasks of this day :{" "}
					{day_tasks.map((task) => {
						return (
							<Fragment key={task._id}>
								<ObjectBox object={task} />
							</Fragment>
						);
					})}
				</Section>
				<Section title={"day events"}>
					events of this day :{" "}
					{day_events.map((event) => {
						return (
							<Fragment key={event._id}>
								<ObjectBox object={event} />
							</Fragment>
						);
					})}
				</Section>

				<Section title="bars">
					{[
						{ start: start_timestamp, end: start_timestamp + 12 * 3600 * 1000, range_label : "day_half_1"},
						{ start: start_timestamp + 12 * 3600 * 1000, end: end_timestamp, range_label : "day_half_2" },
					].map((object, object_index) => {
						return (
							<div className="flex" key={object_index}>
								<div className="w-1/5">
									<div className="text-center" style={{ height: "30px" }}>
										time
									</div>
									<div className="text-center" style={{ height: "30px" }}>
										tasks
									</div>
									<div className="text-center" style={{ height: "30px" }}>
										events
									</div>
								</div>
								<div className="w-4/5">
									<div
										className="w-full bg-red-400"
										style={{ height: "30px" }}
									></div>
									{[
										{ items: JSON.parse(JSON.stringify(day_tasks)), ...object ,type_label : 'tasks'},
										{
											items: JSON.parse(JSON.stringify(day_events)),
											...object,
											type_label : 'events'
										},
									].map((type, type_index) => {
										return (
											<div
												key={type_index}
												className="w-full bg-stone-100 relative"
												style={{ height: "30px" }}
											>
												{timestamp_filled_range({ ...type }).map(item => {return {...item,type_label : type.type_label}}).map(
													(item, index, array) => {
														return (
															<div
																key={index}
																style={{
																	position: "absolute",
																	left: item.start_percent + "%",
																	width:
																		item.end_percent -
																		item.start_percent +
																		"%",
																	height: "100%",
																	backgroundColor:
																		item.value === null
																			? "white"
																			: calendar_categories.find(
																					(i) =>
																						i._id ==
																						item.category_id
																			).color,
																	overflow: "hidden",
																	whiteSpace: "nowrap",
																	textOverflow : "ellipsis"
																}}
																className={`${
																	index !== 0 ? "border-l" : ""
																} ${
																	index !== array.length - 1
																		? "border-r"
																		: ""
																	} border-stone-400 flex justify-center items-center`}
																onClick={()=>open_item_page(item)}
															>
																{item.title}
															</div>
														);
													}
												)}
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</Section>
			</div>
		</>
	);
};

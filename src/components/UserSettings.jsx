import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_users, update_document, upload_files } from "../../api/client";
import { Section } from "./section";
import Select from "react-select";
export const UserSettings = () => {
	var [inputs_statuses, set_inputs_statuses] = useState({
		email_address: false,
		mobile: false,
		full_name: false,
		username: false,
	});
	var user_id = localStorage.getItem("user_id");
	var [user, set_user] = useState(null);
	async function get_data() {
		set_user((await get_users({ filters: { _id: user_id } }))[0]);
	}
	async function simple_update(key, new_value) {
		var update_set = {};
		update_set[key] = new_value;
		await update_document({
			collection: "users",
			update_filter: {
				_id: user_id,
			},
			update_set,
		});
		get_data();
	}
	async function set_profile_picture() {
		var files = document.getElementById("new_profile_image_input").files;
		if (files.lenght === 0) {
			alert("first select an image");
			return;
		}
		await upload_files({
			data: { user_id },
			input_element_id: "new_profile_image_input",
			task: "set_new_profile_picture",
		});
		get_data();
	}
	useEffect(() => {
		get_data();
	}, []);
	if (user === null) return <h1>user data is being loaded...</h1>;
	return (
		<>
			<h1>UserSettings</h1>
			<div style={{ width: "200px", height: "200px" }}>
				{user.profile_image ? (
					<img
						src={
							new URL(`/profile_images/${user.profile_image}`, window.api_endpoint)
								.href
						}
						className="w-full h-full"
					/>
				) : (
					<div className="w-full h-full bg-blue-600"></div>
				)}
			</div>
			<input type="file" id="new_profile_image_input" />
			<button onClick={set_profile_picture}>set this new profile image</button>
			<Section title={"selecting type of calendar"}>
				<Select
					onChange={(e) => simple_update("calendar_type", e.value)}
					options={["persian", "arabic", "english"].map((type) => {
						return {
							value: type,
							label: type,
						};
					})}
					value={{ value: user.calendar_type, label: user.calendar_type }}
				/>
			</Section>

			<Section title={"selecting starting day of week"}>
				<Select
					onChange={(e) => simple_update("week_starting_day", e.value)}
					options={[
						{
							label: "popluar options",
							options: ["saturday", "sunday", "monday"].map((i) => {
								return { value: i, label: i };
							}),
						},

						{
							label: "others",
							options: ["tuesday", "wednesday", "thursday", "friday"].map((i) => {
								return { value: i, label: i };
							}),
						},
					]}
					value={{ value: user.week_starting_day, label: user.week_starting_day }}
				/>
			</Section>
			<Section title={"selecting language"}>
				<Select
					onChange={(e) => simple_update("language", e.value)}
					options={[
						{ value: "english", label: "english" },
						{ value: "persian", label: "persian" },
					]}
					value={{ value: user.language, label: user.language }}
				/>
			</Section>
			<Section title={"changing personal information"}>
				{["email_address", "mobile", "username", "full_name"].map((i, index) => {
					return (
						<div key={index} className="block">
							{user[i] ? (
								<>
									<span>{i}</span> :{" "}
									<input
										value={user[i]}
										onChange={(event) => simple_update(i, event.target.value)}
										disabled={!inputs_statuses[i]}
									/>
									<button
										onClick={() =>
											set_inputs_statuses((prev_statuses) => {
												var tmp = { ...prev_statuses };
												tmp[i] = !prev_statuses[i];
												return tmp;
											})
										}
									>
										{inputs_statuses[i]
											? "disable modification"
											: "enable modification"}
									</button>
								</>
							) : (
								<>
									<span>{i}</span> :{" "}
									<span>there is not any value for this field yeat</span>
									<button
										className="border border-green-600 rounded  px-2 ml-2"
										onClick={(event) => {
											simple_update(
												i,
												window.prompt(`enter new value for ${i}`)
											);
										}}
									>
										set a value
									</button>
								</>
							)}
						</div>
					);
				})}
			</Section>
		</>
	);
};

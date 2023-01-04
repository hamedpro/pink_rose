import { check_being_collaborator, gen_verification_code } from "../common_helpers.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import formidable from "formidable";
//app.use(express.static("./uploaded/"));
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import { is_there_any_conflict } from "../common_helpers.js";
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
var { frontend_port, api_port, api_endpoint, db_name } = JSON.parse(
	fs.readFileSync("./env.json", "utf-8")
);
var db = client.db(db_name);
async function init() {
	["./uploaded", "./uploaded/resources", "./uploaded/profile_images"].forEach((path) => {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
	});
	//todo also check inside the code for todos and make a  --
	//app for it
	//todo take care about length of texts and max length of cells
}
async function main() {
	var app = express();
	app.use(cors({ origin: "http://localhost:3000", credentials: true })); //todo read origin from env so when port or protocol changes it will keep going working properly
	app.use(cookieParser());
	app.use(express.json());
	app.use(express.static("./uploaded/"));
	try {
		await init();
	} catch (e) {
		console.log(e);
		process.exit();
	}
	//todo use todos of my other applications
	/* todo validate the data and delete all extra fields and
	 ... before processing the request */
	app.all("/", async (req, res) => {
		var task = req.headers.task;
		var body = req.body;
		if (task === undefined) {
			res.json(`there is not any task in request's body`);
		} else if (task === "auth") {
			var user = await db.collection("users").findOne({ _id: ObjectId(req.body.user_id) });

			if (req.body.verf_code !== undefined) {
				var current_verification_code = await db
					.collection("verification_codes")
					.findOne({ user_id: user._id });
				if (current_verification_code == null) {
					res.status(400).json(
						"there is not any verification code sending request was done for this uesr please request a verification code first"
					);
				}
				if (current_verification_code.value == req.body.verf_code) {
					var update_filter = { _id: ObjectId(req.body.user_id) };
					var update_object = {};
					update_object[current_verification_code.kind + "_is_verified"] = true;
					await db.collection("users").updateOne(update_filter, { $set: update_object });
					console.log({ update_filter, update_object });
					res.json(true);
				} else {
					res.json(false);
				}
			} else if (req.body.password !== undefined) {
				res.json(user.password == req.body.password);
			}
		} else if (task === "send_verification_code") {
			// body :{ kind : "mobile"  || "email_address" , user_id : string}
			var user = await db.collection("users").findOne({ _id: ObjectId(req.body.user_id) });
			if (user === undefined) {
				res.status(400).json("there is not any user even found with that details");
				return;
			}
			switch (req.body.kind) {
				case "mobile":
					var verf_code = gen_verification_code();
					//send code to the user through api request to sms web service

					//deleting previous verf_code if present:
					if (
						(await db
							.collection("verification_codes")
							.findOne({ user_id: user._id })) !== null
					) {
						await db.collection("verification_codes").deleteOne({ user_id: user._id });
					}

					await db
						.collection("verification_codes")
						.insertOne({ value: verf_code, user_id: user._id, kind: req.body.kind });
					res.json("verification_code was sent");
					break;
				case "email_address":
					var verf_code = gen_verification_code();
					//send code to the user through api request to email sending web service

					//deleting previous verf_code if present:
					if (
						(await db
							.collection("verification_codes")
							.findOne({ user_id: user._id })) !== null
					) {
						await db.collection("verification_codes").deleteOne({ user_id: user._id });
					}
					await db
						.collection("verification_codes")
						.insertOne({ value: verf_code, user_id: user._id, kind: req.body.kind });
					res.json("verification_code was sent");
					break;
				default:
					res.status(400).send();
			}
		} else if (task === "move_task_or_event") {
			//todo
		} else if (task === "update_document") {
			//body must be like : {collection : string,update_filter : object, update_set : object}
			var update_filter = req.body.update_filter;
			if (update_filter._id !== undefined) {
				update_filter._id = ObjectId(update_filter._id);
			}
			var update_statement = await db
				.collection(req.body.collection)
				.updateOne(update_filter, { $set: req.body.update_set });
			res.json(update_statement);
		} else if (task === "flexible_user_finder") {
			var users = await db.collection("users").find().toArray();
			var all_values = [];
			users.forEach((user) => {
				all_values.push(
					user._id.toString(),
					user.username,
					user.mobile,
					user.email_address
				);
			});
			var matches_count = all_values.filter((value) => value == req.body.value).length;
			if (matches_count === 0) {
				res.status(400).json({
					status: 2,
					info: "there is more not any match in valid search resources",
				});
			} else if (matches_count === 1) {
				var matched_user = users.find((user) => {
					var tmp = [user.email_address, user.mobile, user._id.toString(), user.username];
					console.log({ list: tmp, value: req.body.value });
					return tmp.includes(req.body.value);
				});
				res.json(matched_user);
			} else {
				res.status(400).json({
					status: 3,
					info: "there is more than one match in valid search resources",
				});
			}
		} else if (task === "get_user_data_hierarchy") {
			var user_id = req.body.user_id;
			var user_workspaces = (await db.collection("workspaces").find().toArray()).filter((i) =>
				check_being_collaborator(i, user_id)
			);
			var user_workflows = (await db.collection("workflows").find().toArray()).filter((i) =>
				check_being_collaborator(i, user_id)
			);
			var user_notes = (await db.collection("notes").find().toArray()).filter((i) =>
				check_being_collaborator(i, user_id)
			);
			var user_tasks = (await db.collection("tasks").find().toArray()).filter((i) =>
				check_being_collaborator(i, user_id)
			);
			var resources = (await db.collection("resources").find().toArray()).filter((i) =>
				check_being_collaborator(i, user_id)
			);
			var user_hierarchy = {
				workspaces: user_workspaces.map((ws) => {
					return {
						...ws,
						workflows: user_workflows
							.filter((wf) => wf.workspace_id == ws._id)
							.map((wf) => {
								return {
									...wf,
									notes: user_notes.filter((note) => note.workflow_id == wf._id),
									tasks: user_tasks.filter((task) => task.workflow_id == wf._id),
									resources: resources.filter(
										(resource) => resource.workflow_id == wf._id
									),
								};
							}),
					};
				}),
			};
			res.json(user_hierarchy);
		} else if (task === "set_new_profile_picture") {
			var form = formidable({ UploadDir: "./uploaded/profile_images" });
			await new Promise((resolve, reject) => {
				form.parse(req, async (err, fields, files) => {
					var { user_id } = JSON.parse(fields.data);
					var user = await db.collection("users").findOne({ _id: ObjectId(user_id) });
					if (user.profile_image) {
						fs.rmSync(`./uploaded/profile_images/${user.profile_image}`, {
							force: true,
						});
					}
					var file = files[Object.keys(files)[0]];
					var new_file_name = `${user_id}-${file.originalFilename}`;
					fs.renameSync(file.filepath, `./uploaded/profile_images/${new_file_name}`);
					await db
						.collection("users")
						.updateOne(
							{ _id: ObjectId(user_id) },
							{ $set: { profile_image: new_file_name } }
						);
					resolve();
				});
			});
			res.json({});
		} else if (task === "upload_new_resources") {
			var form = formidable({ UploadDir: "./uploaded/resources" });
			res.json(
				await new Promise((resolve, reject) => {
					form.parse(req, async (err, fields, files) => {
						var files_data = JSON.parse(fields.files_data);
						var data = JSON.parse(fields.data);
						var promises = [];
						Object.keys(files).forEach((key) => {
							promises.push(
								db
									.collection("resources")
									.insertOne({
										...data,
										file_data: files_data[key],
									})
									.then(async (result) => {
										var inserted_row_id = result.insertedId.toString();
										await fs.promises.rename(
											files[key].filepath,
											path.join("./uploaded/resources/", inserted_row_id)
										);
										return inserted_row_id;
									})
									.then()
							);
						});
						var new_resource_ids = await Promise.all(promises);
						resolve(new_resource_ids);
					});
				})
			);
		} else if (task === "get_collection") {
			//body should be like this :{collection_name : string ,filters : {}}
			var filters = req.body.filters;
			if (Object.keys(filters).includes("_id")) {
				filters["_id"] = ObjectId(filters["_id"]);
			}
			var tasks = await db.collection(req.body.collection_name).find(filters).toArray();
			res.json(tasks);
		} else if (task === "new_document") {
			//body should be like this : {collection_name : string , document : object}
			var inserted_row = await db
				.collection(req.body.collection_name)
				.insertOne(req.body.document);
			res.json(inserted_row.insertedId);
		} else if (task === "mark_task_as_done") {
			//body should be like this : {task_id : string}
			//first check if we do this there will be any conflict or not
			var events = await db.collection("events").find().toArray();
			var this_task = await db
				.collection("tasks")
				.findOne({ _id: ObjectId(req.body.task_id) });

			if (
				is_there_any_conflict({
					end: this_task.end_date,
					end: this_task.start_date,
					items: events,
				})
			) {
				res.json({
					has_error: true,
					error: "if this task's done status change to true there will be a conflict between this new done task and an existing event",
				});
				return;
			}
			await db
				.collection("tasks")
				.updateOne({ _id: ObjectId(req.body.task_id) }, { is_done: true });
			res.json({});
		} else if (task === "delete_document") {
			//body should look like this : {filter_object : object , collection_name : string}
			var filters = req.body.filters;
			if (Object.keys(filters).includes("_id")) {
				filters["_id"] = ObjectId(filters["_id"]);
			}
			res.json(await db.collection(req.body.collection_name).deleteOne(filters));
		} else if (task === "custom_delete") {
			//how to use it : to delete a workspace with id=foo : context : "workspaces" id=foo
			//possible options for context : "workspaces" , "workflows" , "notes" , "resources" , "tasks"
			var { context, id } = req.body;
			switch (context) {
				case "workspaces":
					await db.collection("workspaces").deleteOne({ _id: ObjectId(id) });
					await db.collection("workflows").deleteMany({ workspace_id: id });
					await db.collection("notes").deleteMany({ workspace_id: id });
					var resources = await db
						.collection("resources")
						.find({ workspace_id: id })
						.toArray();
					for (var resource in resources) {
						fs.rmSync(`./uploaded/resources/${resource._id}`);
						await db.collection("resources").deleteOne({ _id: ObjectId(resource._id) });
					}
					await db.collection("tasks").deleteMany({ workspace_id: id });
					break;
				case "workflows":
					await db.collection("workflows").deleteOne({ _id: id });
					await db.collection("notes").deleteMany({ workflow_id: id });
					var resources = await db
						.collection("resources")
						.find({ workflow_id: id })
						.toArray();
					for (var resource in resources) {
						fs.rmSync(`./uploaded/resources/${resource._id}`);
						await db.collection("resources").deleteOne({ _id: ObjectId(resource._id) });
					}
					await db.collection("tasks").deleteMany({ workflow_id: id });
					break;
				case "notes":
					await db.collection("notes").deleteOne({ _id: ObjectId(id) });
					var all_tasks = await db.collection("tasks").find().toArray();
					for (var task of all_tasks.filter((i) => i.linked_notes.includes(id))) {
						await db
							.collection("tasks")
							.updateOne(
								{ _id: ObjectId(task._id) },
								{ linked_notes: task.linked_notes.filter((i) => i !== id) }
							);
					}
					break;
				case "resources":
					await db.collection("resources").deleteOne({ _id: ObjectId(id) });
					fs.rmSync(`./uploaded/resources/${id}`);
					break;
				case "tasks":
					await db.collection("tasks").deleteOne({ _id: ObjectId(id) });
					break;
			}
			res.json({})
		} else if (task === "custom_get_collection") {
			//lets explain what it does by an example :
			//if context is "workspaces" and user_id is 'something' :
			//it returns all workspaces which this user is a collaborator of
			//and also this is true about workflows , tasks , resources , notes
			var result = (await db.collection(req.body.context).find().toArray()).filter((item) =>
				check_being_collaborator(item, req.body.user_id)
			);
			res.json(result);
		} else {
			res.json('unknown value for "task"');
		}
	});
	//todo add try catch blocks for all possible tasks
	/* 
		to know how to use each route please 
		look at client.js file functions
	*/

	//important todo : res.end or res.json at the end of async requests becuse axios will await until this happens
	var server = app.listen(api_port, () => {
		console.log(`server started listening`);
	});
}
main();

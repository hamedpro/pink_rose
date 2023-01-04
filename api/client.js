import axios from "axios";
var window = { api_endpoint: "http://localhost:4000" };
export async function custom_axios({
	task,
	body = {},
	content_type_json = true,
	responseType = undefined,
}) {
	var api_endpoint = window.api_endpoint;
	var method = "POST"; // case insensitive,
	var route = "/";
	var headers = {
		task,
	};
	if (content_type_json) {
		headers["Content-Type"] = "application/json";
	}
	var conf = {
		url: new URL(route, api_endpoint).href,
		method: method.toUpperCase(),
		data: body,
		headers,
		withCredentials: true,
	};
	if (responseType) {
		conf.responseType = responseType;
	}
	var response = await axios(conf);

	return response.data;
}
export var get_collection = ({ collection_name, filters }) =>
	custom_axios({
		task: "get_collection",
		body: {
			collection_name,
			filters,
		},
	});
export var custom_get_collection = ({ context, user_id }) =>
	custom_axios({
		task: "custom_get_collection",
		body: {
			context,
			user_id,
		},
	});
export var delete_document = ({ collection_name, filters }) =>
	custom_axios({
		task: "delete_document",
		body: {
			filters,
			collection_name,
		},
	});
export var new_document = ({ collection_name, document }) =>
	custom_axios({
		task: "new_document",
		body: {
			collection_name,
			document,
		},
	});
export var update_document = ({ collection, update_filter, update_set }) =>
	custom_axios({
		task: "update_document",
		body: {
			collection,
			update_filter,
			update_set,
		},
	});

export var new_user = ({ body }) => new_document({ collection_name: "users", document: body });

export var get_users = ({ filters = {} }) => get_collection({ collection_name: "users", filters });

export var delete_user = ({ user_id }) =>
	delete_document({
		collection_name: "users",
		filters: {
			_id: user_id,
		},
	});
export var auth = async ({ user_id, password = undefined, verf_code = undefined }) =>
	//about args : user_id is necessary but only one of verf_code or password should be !undefined
	//returns a json stringified boolean which indicates that user auth was done or not
	//extra description : if password is included it checks user password with included one
	//and if verf_code is there it will check it with the latest verf_code of that user (if present) in verf_codes collection
	//important todo think about if user's password is null and we pass null to this func too
	await custom_axios({
		task: "auth",
		body: {
			user_id,
			password,
			verf_code,
		},
	});

export var send_verification_code = async ({ kind, user_id }) =>
	//body should contain user_id and also kind that should be either "mobile" or "email_address"
	//if this function doesnt throw anything its done
	//test status : passed
	await custom_axios({
		task: "send_verification_code",
		body: {
			kind,
			user_id,
		},
	});
export var new_note = ({ collaborators, title, workflow_id, workspace_id }) =>
	new_document({
		collection_name: "notes",
		document: {
			collaborators,
			title,
			init_date: new Date().getTime(),
			workflow_id,
			workspace_id,
		},
	});
export var new_workspace = async ({ title, description, collaborators }) =>
	new_document({
		collection_name: "workspaces",
		document: {
			init_date: new Date().getTime(),
			title,
			description,
			collaborators,
		},
	});
export var new_task = ({
	linked_notes,
	end_date,
	workflow_id,
	collaborators,
	workspace_id,
	start_date,
	title,
	category_id,
}) =>
	new_document({
		collection_name: "tasks",
		document: {
			init_date: new Date().getTime(),
			linked_notes,
			end_date,
			workflow_id,
			collaborators,
			workspace_id,
			start_date,
			title,
			category_id,
		},
	});
export var new_calendar_category = ({ user_id, color, name }) =>
	new_document({
		collection_name: "calendar_categories",
		document: {
			user_id,
			color,
			name,
		},
	});
export var get_calendar_categories = ({ user_id }) =>
	get_collection({
		collection_name: "calendar_categories",
		filters: {
			user_id,
		},
	});

export var get_user_events = ({ user_id }) =>
	get_collection({
		collection_name: "events",
		filters: {
			user_id
		},
	});
export var delete_task = ({ task_id }) =>
	delete_document({
		collection_name: "tasks",
		filters: {
			_id: task_id,
		},
	});
export var delete_event = ({ event_id }) =>
	delete_document({
		filters: {
			_id: event_id,
		},
		collection_name: "events",
	});
export var new_event = ({
	end_date,
	workflow_id,
	user_id,
	workspace_id,
	start_date,
	title,
	category_id,
}) =>
	new_document({
		collection_name: "events",
		document: {
			init_date: new Date().getTime(),
			end_date,
			workflow_id,
			user_id,
			workspace_id,
			start_date,
			title,
			category_id,
		},
	});
export var update_note = ({ note_id, update_set }) =>
	update_document({
		collection: "notes",
		update_filter: {
			_id: note_id,
		},
		update_set,
	});
//todo test from here to the bottom (in current commit)
export var get_tasks = ({ filters = {} }) =>
	get_collection({
		collection_name: "tasks",
		filters,
	});
export var get_workspace_workflows = ({ workspace_id }) =>
	get_collection({
		collection_name: "workflows",
		filters: {
			workspace_id,
		},
	});
export var new_workflow = ({ workspace_id, title, description, collaborators }) =>
	new_document({
		collection_name: "workflows",
		document: {
			title,
			description,
			collaborators,
			init_date: new Date().getTime(),
			workspace_id,
		},
	});
export var update_user = ({ kind, new_value, user_id }) => {
	var update_set = {};
	update_set[kind] = new_value;
	return update_document({
		collection: "users",
		update_filter: {
			_id : user_id,
		},
		update_set,
	});
};

export var flexible_user_finder = async ({ value }) =>
	//this one search for that value in all of these values : user_ids, usernames, email_addresses, mobiles
	//and returns that user which matches
	await custom_axios({
		task: "flexible_user_finder",
		body: {
			value,
		},
	});

export var get_workflows = ({ filters = {} }) =>
	get_collection({
		collection_name: "workflows",
		filters,
	});
export var get_user_data_hierarchy = async ({ user_id }) =>
	await custom_axios({
		task: "get_user_data_hierarchy",
		body: {
			user_id,
		},
	});

export var upload_files = async ({ task, data = {}, input_element_id }) => {
	var form = new FormData();
	var files = document.getElementById(input_element_id).files;
	var files_data = {};
	for (var i = 0; i < files.length; i++) {
		var file = files[i.toString()];
		form.append(i.toString(), file);
		files_data[i.toString()] = {};
		for (const prop in file) {
			files_data[i.toString()][prop] = file[prop];
		}
	}
	form.append("data", JSON.stringify(data));
	form.append("files_data", JSON.stringify(files_data));

	return await custom_axios({
		content_type_json: false,
		body: form,
		task,
	});
};

export var upload_new_resources = ({ data, input_element_id }) =>
	upload_files({
		task: "upload_new_resources",
		data,
		input_element_id,
	});

export var get_resources = ({ filters = {} }) =>
	get_collection({
		collection_name: "resources",
		filters,
	});
export var custom_axios_download = async ({ url, file_name }) => {
	var response = await axios({
		url,
		method: "GET",
		withCredentials: true,
		responseType: "blob",
	});
	// create file link in browser's memory
	const href = URL.createObjectURL(response.data);

	// create "a" HTML element with href to file & click
	const link = document.createElement("a");
	link.href = href;
	link.setAttribute("download", file_name); //file name should have extension, ex : fileff.pdf
	document.body.appendChild(link);
	link.click();

	// clean up "a" element & remove ObjectURL
	document.body.removeChild(link);
	URL.revokeObjectURL(href);
};

export var download_resource = async ({ resource_id }) => {
	var resource_name = (await get_resources({ filters: { _id: resource_id } }))[0].file_data.name;
	custom_axios_download({
		url: new URL(`/resources/${resource_id}`, window.api_endpoint).href,
		file_name: resource_name,
	});
};

export var new_comment = ({ date, text, user_id, workspace_id, workflow_id, note_id, task_id }) =>
	new_document({
		collection_name: "comments",
		document: { date, text, user_id, workspace_id, workflow_id, note_id, task_id },
	});

export var get_comments = ({ filters }) =>
	get_collection({
		collection_name: "comments",
		filters,
	});

export var delete_comment = ({ filters }) =>
	delete_document({
		collection_name: "comments",
		filters,
	});

export var edit_comment = ({ new_text, comment_id }) =>
	update_document({
		collection: "comments",
		update_filter: {
			_id: comment_id,
		},
		update_set: {
			text: new_text,
			edited: true,
		},
	});
export var modify_collaborator_access_level = async ({ context, id, user_id, new_access_level }) => { 
		//how to work with it :
		// when params are = context : "workspaces" , id : "foo" , user_id : 'bar' , new_access_level : 2 =>
		//it search between collaborators of a workspace which it's id is foo and sets access level of that user who it's user_id is bar to 2
		
	var tmp = (await get_collection({ collection_name: context, filters: { _id: id } }))[0][
		"collaborators"
	];

	var new_collaborators = tmp.map((i) => {
		if (i.user_id === user_id) {
			return { ...i, access_level: new_access_level};
		} else {
			return { ...i };
		}
	});
	await update_document({
		collection: context,
		update_filter: {
			_id : id
		},
		update_set: {
			collaborators : new_collaborators 
		}
	})
}
export var leave_here = async ({ context_id, context, user_id }) => {
	//how to use it : if a user with id = 'foo' wants to leave a
	//workspace with id = 'bar' => context : "workspaces", context_id : 'bar' , user_id = 'foo'
	var tmp = (await get_collection({ collection_name: context, filters: { _id: context_id } }))[0][
		"collaborators"
	];
	await update_document({
		collection: context,
		update_filter: {
			_id: context_id,
		},
		update_set: {
			collaborators: tmp.filter((i) => i.user_id !== user_id),
		},
	});
};

export var custom_delete = async ({ context, id }) =>
	await custom_axios({
		body: {
			context,
			id,
		},
		task: "custom_delete",
	});
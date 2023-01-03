import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { get_collection } from "../../api/client";
import ObjectBox from "./ObjectBox";

export const Event = () => {
	var { user_id, event_id } = useParams();
	var [event, set_event] = useState(null);
	async function get_data() {
		var event = (await get_collection({
			collection_name: "events",
			filters: {
				creator_user_id : user_id,
				_id: event_id,
			},
		}))[0];
		set_event(event);
	}
	useEffect(() => {
		get_data();
	},[]);
	if (event === null) return <h1>still loading user event...</h1>;
	return (
		<>
			<h1>Event</h1>
			<ObjectBox object={event} />
		</>
	);
};

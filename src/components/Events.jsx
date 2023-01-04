import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { get_collection } from "../../api/client";
import ObjectBox from "./ObjectBox";

export const Events = () => {
	var user_id = localStorage.getItem("user_id");
	var [events, set_events] = useState(null);
	async function get_data() {
		var events = await get_collection({
			collection_name: "events",
			filters: {user_id,
			},
		});
		set_events(events);
	}
	useEffect(() => {
		get_data();
	}, []);
	if (events === null) return <h1>still loading user event...</h1>;
	return (
		<>
			<h1>Event</h1>
			{events.map((event, index) => {
				return (
					<Fragment key={index}>
						<ObjectBox object={event} />
					</Fragment>
				);
			})}
		</>
	);
};

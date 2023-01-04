import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { download_resource, get_resources } from "../../api/client";
import { CollaboratorsManagementBox } from "./CollaboratorsManagementBox";
import ObjectBox from "./ObjectBox";

export const Resource = () => {
	var { resource_id } = useParams();
	var [resource_row, set_resource_row] = useState(null);
	async function get_data() {
		set_resource_row((await get_resources({ filters: { _id: resource_id } }))[0]);
	}
	useEffect(() => {
		get_data();
	}, []);
	if (resource_row === null) return <h1>loading resource_row ... </h1>;
	return (
		<>
			<h1>resource</h1>
			<CollaboratorsManagementBox context={"resources"} id={resource_id} /> 
			<ObjectBox object={resource_row} />
			<button onClick={() => download_resource({ resource_id: resource_row._id })}>
				download this resource
			</button>
		</>
	);
};

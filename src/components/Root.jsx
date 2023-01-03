import React from "react";
import { Link } from "react-router-dom";
import {} from "../../api/client";
import { Section } from "./section";

export const Root = () => {
	return (
		<>
			<h1>here is root route of the website</h1>
			<Section title="options">
				<Link to="/login">i want to login in my account</Link>
				<br />
				<Link to="/register">i want to create a new account</Link>
			</Section>
		</>
	);
};

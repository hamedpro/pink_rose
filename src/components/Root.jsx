import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Section } from "./section";

export const Root = () => {
	var nav = useNavigate()
	useEffect(() => {
		if (localStorage.getItem('user_id') !== null) { 
				nav('/dashboard')	
		}
	},[])
	if (localStorage.getItem('user_id') !== null) {
		return <h1>navigating to user dashboard ...</h1>
	}
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

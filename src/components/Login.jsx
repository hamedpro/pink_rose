import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, flexible_user_finder, send_verification_code } from "../../api/client";
import { setCookie } from "../../common_helpers.js";
import { Section } from "./section";
import { StyledInput } from "./styled_elements";

function SelectUser({ set_user, set_current_tab }) {
	var [identity, set_identity] = useState(null);
	async function find_user() {
		try {
			var response = await flexible_user_finder({
				value: identity,
			});
			set_user(response);
			set_current_tab("select_auth_type");
		} catch (error) {
			console.log(error);
			alert("something went wrong when trying to find user account. details in console");
		}
	}
	return (
		<Section title="login page">
			<p>please enter either one of these and click "find my account" :</p>
			<ul>
				<li>an email_address</li>
				<li>a mobile phone number</li>
				<li>a username</li>
				<li>a user_id</li>
			</ul>
			<input
				className="border border-blue-400 px-2 rounded mx-2"
				onChange={(event) => set_identity(event.target.value)}
			/>
			<button onClick={find_user}>find my account</button>
		</Section>
	);
}
function SelectAuthType({ set_current_tab }) {
	return (
		<Section title="authentication methods">
			<p>select one of these authentication methods :</p>
			<button className="border border-blue-400 rounded px-2 mb-1" onClick={() => set_current_tab("send_verf_code")}>
				send me verification code
			</button>
			<br />
			<button className="border border-blue-400 rounded px-2 mb-1" onClick={() => set_current_tab("check_password")}>
				login using my password
			</button>
		</Section>
	);
}
function CheckPassword({ user, set_current_tab }) {
	var custom_nav = useNavigate();
	var [password, set_password] = useState(null);
	async function password_based_login() {
		try {
			var response = await auth({
				user_id: user._id,
				password,
			});
			if (response === true) {
				alert("auth was performed!");
				window.localStorage.setItem("user_id", user._id);
				custom_nav("/");
			} else {
				alert("your password was wrong. please check it and try again");
			}
		} catch (error) {
			console.log(error);
			alert(
				"something went wrong while trying to make a request to the server : details in console"
			);
		}
	}
	return (
		<>
			{user.password !== undefined && user.password !== null ? (
				<>
					<p>enter your password here</p>
					<input
						className="border border-blue-400 "
						onChange={(event) => set_password(event.target.value)}
					/>
					<button onClick={password_based_login}> check my password </button>
				</>
			) : (
				<>
					<p>
						you have not a password set. please try login with recieving a verification
						code
					</p>
					<button onClick={() => set_current_tab("send_verf_code")}>
						login with verification code
					</button>
				</>
			)}
		</>
	);
}
function SendVerfCode({ user, set_current_tab }) {
	function send_verf_code(kind) {
		//kind should be either "mobile" or "email_address"
		if (!user[kind]) {
			alert(`this user has not this field : ${kind} . please try another option`);
			return;
		} else {
			send_verification_code({
				kind,
				user_id: user._id,
			});
			set_current_tab("check_verf_code");
		}
	}
	return (
		<>
			<p>select one of this options below</p>
			<button onClick={() => send_verf_code("mobile")}>send through sms</button>
			<br />
			<button onClick={() => send_verf_code("email_address")}>
				send through email_address
			</button>
		</>
	);
}
function CheckVerfCode({ user, set_current_tab }) {
	var custom_nav = useNavigate();
	var [verf_code, set_verf_code] = useState(null);
	async function check_verification_code() {
		if (isNaN(Number(verf_code))) {
			alert(
				"verification code is a number but you have entered a value that is not even convertable to number!"
			);
			return;
		}
		try {
			var response = await auth({
				user_id: user._id,
				verf_code: Number(verf_code),
			});
			if (response === true) {
				alert("auth was performed!");
				window.localStorage.setItem("user_id", user._id);
				custom_nav("/");
			} else {
				alert("verification code was not correct. please try checking what you have typed");
			}
		} catch (error) {
			console.log(error);
			alert(
				"something went wrong while trying to make a request to the server : details in console"
			);
		}
	}
	return (
		<>
			<p>enter verification code :</p>
			<StyledInput  onChange={(event) => set_verf_code(event.target.value)} /> 
			<button onClick={check_verification_code}>check verification code </button>
		</>
	);
}
export function Login() {
	var [user, set_user] = useState(null);
	var [current_tab, set_current_tab] = useState("select_user"); // other possible values : check_password, check_verf_code , select_auth_type,send_verf_code
	return (
		<>
			{current_tab === "select_user" ? (
				<SelectUser set_user={set_user} set_current_tab={set_current_tab} />
			) : null}
			{current_tab === "select_auth_type" ? (
				<SelectAuthType set_current_tab={set_current_tab} />
			) : null}
			{current_tab === "check_password" ? (
				<CheckPassword user={user} set_current_tab={set_current_tab} />
			) : null}
			{current_tab === "send_verf_code" ? (
				<SendVerfCode user={user} set_current_tab={set_current_tab} />
			) : null}
			{current_tab === "check_verf_code" ? (
				<CheckVerfCode user={user} set_current_tab={set_current_tab} />
			) : null}
		</>
	);
	//{/* todo checkbox to remember me (also on the other cases) */}
}

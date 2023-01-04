import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { new_user } from "../../api/client";
import { LinkLikeP } from "./link_like_p";
import { Section } from "./section";

export const RegisterPage = ({}) => {
	var nav = useNavigate();
	var [terms_are_accepted, set_terms_are_accepted] = useState(false);
	var [input_value, set_input_value] = useState(null);
	var [kind_of_input, set_kind_of_input] = useState(null);

	async function register() {
		if (!terms_are_accepted) {
			alert("in order to use our services you have to agree with our terms of use");
			return;
		}

		if (input_value === null) {
			alert("select one of those options first");
			return;
		} else if (input_value === "") {
			alert('input value can not be empty')
			return
		}
		try {
			var tmp = {};
			tmp[kind_of_input] = input_value;
			var id_of_new_user = await new_user({ body: tmp });
			alert("all done. navigating to verification page ...");
			nav(
				`/dashboard/verification?next_page=complete_register&user_id=${id_of_new_user}&kind_of_input=${kind_of_input}`
			);
		} catch (error) {
			//todo
			console.error(error);
			alert(
				"something went wrong in progress of asking the server to add a new user (see details in console)"
			);
		}
	}
	return (
		<div className="p-2">
			<Section title="registeing new user">
				<div className="px-2">
					{kind_of_input === null ? (
						<>
							<p>select one of these options below </p>
							{["email_address", "mobile", "username"].map((option, index) => {
								return (
									<button
										className="block border border-blue-400 rounded my-1 px-1"
										key={index}
										onClick={() => set_kind_of_input(option)}
									>
										{index + 1} - {option}
									</button>
								);
							})}
						</>
					) : (
							<>
								<h1 className="mb-2">enter your {kind_of_input} : </h1>
							<input
								onChange={(event) => {
									set_input_value(event.target.value);
								}}
								className="border border-blue-400 rounded px-1"
							/>
						</>
					)}

					<div
						onClick={() =>
							set_terms_are_accepted((terms_are_accepted) => !terms_are_accepted)
						}
						className="flex items-center space-x-1 mt-2"
					>
						{terms_are_accepted ? <CheckBox /> : <CheckBoxOutlineBlank />}i accept{" "}
						<LinkLikeP link="/terms" className="inline-block">
							terms of use
						</LinkLikeP>
						.
					</div>

					<button
						className="border border-blue-400 rounded block mt-2 px-2 py-1 hover:text-white hover:bg-blue-600 duration-300"
						onClick={register}
					>
						register new user
					</button>
				</div>
			</Section>
		</div>
	);
};

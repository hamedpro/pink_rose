import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Attach from "@editorjs/attaches";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import Checklist from "@editorjs/checklist";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { custom_get_collection, update_note } from "../../api/client";
import ObjectBox from "./ObjectBox";
import CommentsBox from "./CommentsBox";
import { CollaboratorsManagementBox } from "./CollaboratorsManagementBox";
export const Note = () => {
  var { note_id } = useParams();
  var user_id = localStorage.getItem("user_id");
  var [note, setNote] = useState(null);
  var [editor_js_instanse, set_editor_js_instance] = useState(null);

  async function init_component() {
		var tmp = (await custom_get_collection({context : "notes",user_id})).find(
			(note) => note._id == note_id
		);
		setNote(tmp);
		var editor_js_configs = {
			holder: "editor-js-div",
			tools: {
				header: {
					class: Header,
					inlineToolbar: true,
				},
				list: {
					class: List,
					inlineToolbar: true,
				},
				attach: {
					class: Attach,
					inlineToolbar: true,
				},
				table: {
					class: Table,
					inlineToolbar: true,
				},
				image: {
					class: ImageTool,
					inlineToolbar: true,
				},
				checklist: {
					class: Checklist,
					inlineToolbar: true,
				},
			},
			onReady: () => {
				console.log("editor js initializing is done.");
				//todo show this console.log like a notification or ... to user
			},
			defaultBlock: "header",
			autofocus: true,
			placeholder: "Type your text here",
		};
		if (tmp.data) {
			editor_js_configs["data"] = tmp.data;
		}
		set_editor_js_instance(new EditorJS(editor_js_configs));
  }
  useEffect(() => {
		init_component();
  }, []);
  const saveHandler = async () => {
		editor_js_instanse.save().then((output_data) => {
			try {
				update_note({ note_id, update_set: { data: output_data } });
				alert("all done");
			} catch (error) {
				console.log(error);
				alert(
					"something went wrong when saving the new edited note data. details in console"
				);
			}
		});
		/* 
      TODO: auto save : pass onChange prop to editor_js_configs before initializing and save changes in that onChange
      and also show an indicator which whenever the data changes it shows loading until the data changes is uploaded succeessfuly
    */
  };
  return (
		<>
			<h1>Note</h1>
			{note !== null && (
				<>
					<h1>note_data : </h1>
					<ObjectBox object={note} />
				</>
			)}
			
			<CollaboratorsManagementBox context='notes' id={ note_id} />
			<div id="editor-js-div"></div>
			<button onClick={saveHandler}>save</button>
			<CommentsBox user_id={user_id} />
		</>
  );
};

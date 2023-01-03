var {exec} = require("child_process");
var fs = require("fs");
var mode = process.argv[2] == "dev" ? "dev" : "start";

var { frontend_port, api_port, api_endpoint, db_name } = JSON.parse(
	fs.readFileSync("./env.json", "utf-8")
);
var start_script = `(node ./api/server.js) & (rm -rf ./dist && npx tailwindcss -c ./tailwind.config.cjs -i ./src/input.css -o ./src/output.css && vite build --base ./ ) && (http-server --cors -p ${frontend_port} -c 1 ./dist)`;
//todo start_script is not tested
var dev_script_parallel_parts = [`npx tailwindcss -c ./tailwind.config.cjs -i ./src/input.css -o ./src/output.css --watch`,`vite --host --strictPort --port ${frontend_port}`,`nodemon ./api/server.js`]
if(mode == "dev"){
	dev_script_parallel_parts.forEach(script_part => {
		var s = exec(script_part)
		s.stdout.on('data', data => console.log(data))
		s.stderr.on('data', data => console.log(data))
	})
}else if(mode === "start"){
	exec(start_script) // todo this wont work on linux (just apply the fix that applied to dev script also to start script)
}

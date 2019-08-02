"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
(() => __awaiter(this, void 0, void 0, function* () {
    const app = express_1.default();
    const port = 8081; // default port to listen
    app.use(body_parser_1.default.json());
    //VERY BAD
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    // filterimage
    // endpoint for posting and getting image filter
    // accepts public image url as input
    // GET METHOD 
    app.get("/filterimage", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { image_url } = req.query;
        if (!image_url) {
            return res.status(422).send(`image_url must be provided`);
        }
        try {
            // call filterImageFromURL method from util.ts
            let file = yield util_1.filterImageFromURL(image_url);
            console.log('filePath is: ' + file); // log statements to debug 
            var path = require('path');
            var filename = path.basename(file);
            console.log(filename);
            // on finish, delete local files
            res.on("finish", () => {
                util_1.deleteLocalFiles([file]);
            });
            // send filtered image as response with status 200
            res.status(200).sendFile(file);
        }
        catch (e) {
            console.log('exception: ' + e.message);
            return res.send(e.message).status(422);
        }
    }));
    // Root URI call
    app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send("Success! Server is up and running. try filterimage?image_url=https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/UN_building.jpg/450px-UN_building.jpg");
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
// obsolete code to handle python script image_filter.py
// const spawn = require("child_process").spawn;
// const pythonProcess = spawn('python', ["src/image_filter.py", filename, file]);
// if (pythonProcess !== undefined) {
//   console.log("inside if statement")
//   // console.log(pythonProcess.stdout)
//   pythonProcess.stdout.on('data', (data : any) => {
//     console.log(data.toString())
//     const check = data.toString().split("\n");
//     console.log(check)
//     if (check[1] === "True" && check[2] === "Success") {
//       console.log('before return, file: '+check[0])
//       console.log(__dirname)
//       return res.sendFile(`${__dirname+'/out/'+filename}`);
//     }
//   });
// }
// pythonProcess.on('error', (err : any) => {
//   console.log('Failed to start subprocess due to:'+err.message);
// });
// pythonProcess.on('close', (code : any) => {
//   console.log(`child process exited with code ${code}`);
//   // process.exit();
// });
//# sourceMappingURL=server.js.map
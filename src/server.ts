import express from 'express';
import { Request, Response } from "express";
import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

(async () => {

  const app = express();
  const port = 8081; // default port to listen
  
  app.use(bodyParser.json());
  
  //VERY BAD
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  
  // filterimage
  // endpoint for posting and getting image filter
  // accepts public image url as input
  // GET METHOD 
  app.get("/filterimage", async (req: Request, res: Response) => {
    
        const { image_url } = req.query;
        if (!image_url) {
          return res.status(422).send(`image_url must be provided`);
        }
        try {
    
          // call filterImageFromURL method from util.ts
          let file = await filterImageFromURL(image_url);
          console.log('filePath is: '+ file) // log statements to debug 
          var path = require('path');
          
          var filename = path.basename(file);
          console.log(filename);
    
          // on finish, delete local files
          res.on("finish", () => {
            deleteLocalFiles([file])
          })
    
          // send filtered image as response with status 200
          res.status(200).sendFile(file);
    
        } catch (e) {
          console.log('exception: '+e.message)
          return res.send(e.message).status(422);
        }
      })

  // Root URI call
  app.get( "/", async ( req:any, res:any ) => {
    res.send("Success! Server is up and running. try filterimage?image_url=https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/UN_building.jpg/450px-UN_building.jpg");
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();




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
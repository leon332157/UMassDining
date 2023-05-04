import express from "express";
import * as http from "http";
import * as https from "https";
import morgan from "morgan";
import * as path from "path";
import { readFileSync } from "fs";

// initialize express.
const app = express();

// Initialize variables.
let port: number = 3000;

// Configure morgan module to log all requests.
app.use(morgan("dev"));

// Setup app folders.
app.use(express.static("out"));

// Set up a route for index.html
/*app.get("*", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(process.cwd(), "out", "index.html"));
});*/

// Start the server.
http.createServer(app).listen(port, "0.0.0.0");
https
  .createServer(
    {
      key: readFileSync("key.pem"),
      cert: readFileSync("cert.pem"),
    },
    app
  )
  .listen(8443, "0.0.0.0");

console.log(`Listening on port ${port}...`);

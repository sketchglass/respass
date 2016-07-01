import * as http from "http";
import * as url from "url";
import * as express from "express";

export const server = http.createServer();
const app = express();

server.on("request", app);

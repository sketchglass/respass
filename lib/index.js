"use strict";
const server_1 = require("./server");
const models_1 = require("./models");
// define models
models_1.Message.sync({});
server_1.bootup();

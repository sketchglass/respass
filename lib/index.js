"use strict";
const models_1 = require("./models");
const server_1 = require("./server");
// define models
models_1.Message.sync({});
server_1.bootup();

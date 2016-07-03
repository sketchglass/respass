import { Message, User, TwitterIntegration, Connection } from "./models"

require('dotenv').config();

let IS_PROD: boolean = process.env.NODE_ENV === "production"

// define models
for (const model of [Message, TwitterIntegration, User]) {
  model.sync({
    force: !IS_PROD
  })
}
// Connection must be cleaned up after restart server
Connection.sync({force: true})

import { app } from "./server";
import "./wsserver"

app.listen(8080);

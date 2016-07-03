import { Message, User, TwitterIntegration } from "./models"

require('dotenv').config();

let IS_PROD: boolean = process.env.NODE_ENV === "production"

// define models
for (const model of [Message, TwitterIntegration, User]) {
  model.sync({
    // !! breaks current db (do not use in production)
    force: !IS_PROD
  })
}

import { app } from "./server";
import "./wsserver"

app.listen(8080);

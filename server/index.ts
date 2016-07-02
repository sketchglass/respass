import { Message, User, TwitterIntegration } from "./models"

let IS_PROD: boolean = process.env.NODE_ENV === "production"

// define models
for (const model of [Message, User, TwitterIntegration]) {
  model.sync({
    // !! breaks current db (do not use in production)
    force: !IS_PROD
  })
}

import { server } from "./server";
import "./wsserver"

server.listen(8080);

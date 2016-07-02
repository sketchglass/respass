import { Message, User } from "./models"

let IS_PROD: boolean = process.env.NODE_ENV === "production"

// define models
Message.sync({
  // !! breaks current db (do not use in production)
  force: !IS_PROD
})
User.sync({
  force: !IS_PROD
})

import { server } from "./server";
import "./wsserver"

server.listen(8080);

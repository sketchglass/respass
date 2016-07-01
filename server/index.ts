import { Message, User } from "./models"

// define models
Message.sync({
  // !! breaks current db (do not use in production)
  force: true
})
User.sync({
  force: true
})

import { server } from "./server";
import "./wsserver"

server.listen(8080);

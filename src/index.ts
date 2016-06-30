import { Server } from "ws"
import { Message, User } from "./models"

// define models
Message.sync({
  // !! breaks current db (do not use in production)
  force: true
})
User.sync({
  force: true
})

import "./wsserver"

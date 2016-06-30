import { Server } from "ws"
import { Message, User } from "./models"
import { bootup } from "./wsserver"

// define models
Message.sync({
  // !! breaks current db (do not use in production)
  force: true
})
User.sync({
  force: true
})


bootup()

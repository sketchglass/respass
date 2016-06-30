import { Server } from "ws"
import { Message } from "./models"
import { bootup } from "./wsserver"

// define models
Message.sync({
  // !! breaks current db (do not use in production)
  // force: true
})


bootup()

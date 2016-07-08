process.env.FRONTEND_URL = "dummy"
process.env.SESSION_SECRET = "dummy"
process.env.TWITTER_CONSUMER_KEY = "dummy"
process.env.TWITTER_CONSUMER_SECRET = "dummy"
process.env.TWITTER_CALLBACK_URL = "dummy"

import {server} from "../server/app"

before(done => {
  server.listen(0, () => {
    done()
  })
})

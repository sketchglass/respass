require('dotenv').config();

import {server} from "./app"

server.listen(process.env.PORT)

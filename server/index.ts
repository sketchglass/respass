require('dotenv').config();

import {listen} from "./server"

listen(process.env.PORT)

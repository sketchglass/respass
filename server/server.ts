import * as http from "http";
import * as express from "express";
import * as session from 'express-session';
import * as passport from "passport";
import {Strategy as TwitterStrategy} from "passport-twitter";
const cors = require("cors");

import {Message, User, TwitterIntegration} from "./models";
import {IMessage, IUser} from "../common/data";
import path = require('path');

export const server = http.createServer();
const app = express();

// TODO: hide secret in production
const SESSION_SECRET = "de0c0de3acdf8eaffc29900d2234b808cd55b201";
const TWITTER_CONSUMER_KEY = "Y2xEYqt27j0t0GEJ17I9xUden";
const TWITTER_CONSUMER_SECRET = "vSomtUuL4TNkSl7dwdMerKr7xO9AfIUpHYPMZTXR5axJvAVIis";

app.use(cors());
app.use(session({secret: SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

// looks  odd, but this is exact where file is.
// (because all javascript files will be created under lib/)
app.use(express.static(path.join(__dirname, '../../ui/dist')));

app.get("/messages", async (req, res) => {
  const messages: any[] = await Message.findAll({
    include: [User],
    //order: "createdAt", <- this doesn't work ???
  });
  const data: IMessage[] = messages.map(m => ({
    text: m.text,
    user: {name: m.user.name}
  }));
  res.json(data);
});

passport.serializeUser((user, done) => {
  done(null, user.id)
});
passport.deserializeUser(async (id, done) => {
  try {
    done(null, await User.findById(id))
  } catch (e) {
    done(e, null);
  }
});

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
}, async (token, secret, profile, done) => {
  try {
    const id = profile.id;
    let integration = await TwitterIntegration.findOne({where: {twitterId: id}});
    let user: any; // workaround
    if (integration) {
      user = await User.findById(integration["userId"]);
    } else {
      user = await User.create({name: profile.username});
      integration = await TwitterIntegration.create({twitterId: id, userId: user.id});
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
}));

const FRONTEND_URL = "http://127.0.0.1:23000/webpack-dev-server/";

app.get("/auth/twitter", passport.authenticate("twitter"));
app.get("/auth/twitter/callback", passport.authenticate("twitter", {successRedirect: FRONTEND_URL, failureRedirect: FRONTEND_URL}));

app.get("/user", (req, res) => {
  if (req.user) {
    const json: IUser = {
      name: req.user.name
    };
    res.json(json);
  } else {
    res.json(null);
  }
});

server.on("request", app);

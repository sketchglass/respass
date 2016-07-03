import {EventEmitter} from "events";
import {API_SERVER} from "./config";
import {IUser} from "../../common/data";

class Auth extends EventEmitter {
  user: IUser;
  loggedOut = false;

  constructor() {
    super();
    this.fetchUser();
  }

  async fetchUser() {
    const req = await fetch(`http://${API_SERVER}/user`, {
      credentials: 'include'
    });
    this.user = await req.json();
    if (!this.user) {
      this.loggedOut = true;
    }
    this.emit("change");
  }

  logIn() {
    location.href = `http://${API_SERVER}/auth/twitter`;
  }

  logOut() {
    location.href = `http://${API_SERVER}/logout`;
  }
}

export const auth = new Auth();

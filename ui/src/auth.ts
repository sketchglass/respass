import {EventEmitter} from "events";
import {API_SERVER} from "./config";
import {IUser} from "../../common/data";

class Auth extends EventEmitter {
  user: IUser;
  signedOut = false;

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
      this.signedOut = true;
    }
    this.emit("change");
  }

  signIn() {
    location.href = `http://${API_SERVER}/auth/twitter`;
  }

  signOut() {
    location.href = `http://${API_SERVER}/logout`;
  }
}

export const auth = new Auth();

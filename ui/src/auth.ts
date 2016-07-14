import {EventEmitter} from "events";
import {API_URL} from "./config";
import {IUser} from "../../common/data";

class Auth extends EventEmitter {
  user: IUser;
  loggedOut = false;

  constructor() {
    super();
    this.fetchUser();
  }

  async fetchUser() {
    const req = await fetch(`${API_URL}/user`, {
      credentials: 'include'
    });
    this.user = await req.json();
    if (!this.user) {
      this.loggedOut = true;
    }
    this.emit("change");
  }

  logIn() {
    location.href = `${API_URL}/auth/twitter`;
  }

  logOut() {
    location.href = `${API_URL}/logout`;
  }
}

export const auth = new Auth();

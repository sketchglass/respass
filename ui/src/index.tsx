import 'normalize.css/normalize.css'
import "../styles/style.scss";

import 'babel-polyfill';
import 'whatwg-fetch';
import * as React from "react";
import * as ReactDOM from "react-dom";
import ThreadView from "./views/ThreadView";

window.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<ThreadView></ThreadView>, document.getElementById("app"));
});

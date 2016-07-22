import 'normalize.css/normalize.css'
import "../styles/style.sass";

import 'babel-polyfill';
import 'whatwg-fetch';
import * as React from "react";
import * as ReactDOM from "react-dom";
import ThreadView from "./views/ThreadView";

window.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<ThreadView></ThreadView>, document.getElementById("app")!);
});

const {GA_TRACKING_ID} = process.env
if (GA_TRACKING_ID) {
  const script = document.createElement("script")
  script.innerHTML = `
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', ${JSON.stringify(GA_TRACKING_ID)}, 'auto');
    ga('send', 'pageview');
  `
  document.body.appendChild(script)
}

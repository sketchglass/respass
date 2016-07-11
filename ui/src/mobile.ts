import * as Hammer from "hammerjs"

// if(window.matchMedia("(max-width: 500px)").matches) {
//   // create overlay
//   const element = document.createElement("div")
//   element.style.width = "300px"
//   element.style.height = "100%"
//   element.style.zIndex = "2"
//   element.style.top = "0"
//   element.style.left = "0"
//   element.style.position = "fixed"
//   document.body.appendChild(element)
//
//   const mc = new Hammer(element)
//   mc.on("swiperight", () => {
//     const messageForm = <HTMLElement>document.querySelector(".message-form")
//     messageForm.style.zIndex = "0"
//     const userList = <HTMLElement>document.querySelector(".user-list")
//     userList.style.display = "flex"
//   })
//   mc.on("swipeleft", () => {
//     const messageForm = <HTMLElement>document.querySelector(".message-form")
//     messageForm.style.zIndex = "4"
//     const userList = <HTMLElement>document.querySelector(".user-list")
//     userList.style.display = "none"
//   })
// }

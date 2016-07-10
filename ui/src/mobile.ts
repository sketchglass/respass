import * as Hammer from "hammerjs"

if(window.matchMedia("(max-width: 500px)").matches) {
  // create overlay
  const element = document.createElement("div")
  element.style.width = "400px"
  element.style.height = "100%"
  element.style.zIndex = "100"
  element.style.top = "0"
  element.style.left = "0"
  element.style.position = "fixed"
  document.body.appendChild(element)

  const mc = new Hammer(element)
  mc.on("swiperight", () => {
    let userList = <HTMLElement>document.querySelector(".user-list")
    userList.style.display = "flex"
  })
  mc.on("swipeleft", () => {
    let userList = <HTMLElement>document.querySelector(".user-list")
    userList.style.display = "none"
  })
}

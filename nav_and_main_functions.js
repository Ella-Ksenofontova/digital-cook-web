/**
 * Changes visibility of navigation buttons (to be precise, they're customized links).
 */

export function toggleNavButtons() {
    let navButtons = Array.from(nav.children).filter(item => item.tagName == "A");
    for (let navButton of navButtons) {
        navButton.hidden = !navButton.hidden;
        if (!navButton.hidden) {
            navButton.style.width = "50px";
            navButton.style.height =  navButton.id == "homepage" ? "60px" : "70px";
            navButton.style.fontSize = "45px";
            navButton.tabIndex = "0";
        } else {
            navButton.style.width = "0";
            navButton.style.height = "0"
            navButton.style.fontSize = "0";
            navButton.tabIndex = "-1";
        }
    }
}

/**
 * Changes height of the _main_ tag either if the window has been resized or if height of tag's content has been changed.
 */

export function changeMainHeight() {
    let mainHeight = parseInt(getComputedStyle(main).padding) * 2;
    let mainChildren = main.children;

    for (let child of mainChildren) {
        mainHeight += Math.max(child.scrollHeight, child.offsetHeight);
    }

    let headerHeight = header.offsetHeight;

    if (mainHeight > innerHeight - headerHeight) {
        main.style.height = mainHeight + 20 + "px";
    } else {
        main.style.height = innerHeight - headerHeight + "px"
    }
}

/**
 * Link to object that represents _main_ tag of the document.
 */

export let main = document.querySelector("main")


let header = document.querySelector(".header");
let nav = document.querySelector("nav");

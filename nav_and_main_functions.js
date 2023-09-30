/**
 * Changes visibility of navigation buttons (to be precise, they're customized links).
 */

export function toggleNavButtons() {
    let navButtons = Array.from(nav.children).filter(item => item.tagName == "A");
    for (let navButton of navButtons) {
        navButton.hidden = !navButton.hidden;
        if (!navButton.hidden) {
            navButton.style.width = "50px";
            navButton.style.height = "70px";
            navButton.style.fontSize = "45px";
            navButton.tabIndex = "0";

            if (navButton.firstElementChild.tagName == "IMG") {
                navButton.firstElementChild.style.transitionDuration = "1s";

                navButton.firstElementChild.width = "45";
                navButton.firstElementChild.height = "45";

                navButton.firstElementChild.style.width = "45px";
                navButton.firstElementChild.style.height = "45px";
            }
        } else {
            navButton.style.width = "0";
            navButton.style.height = "0"
            navButton.style.fontSize = "0";
            navButton.tabIndex = "-1";

            if (navButton.firstElementChild.tagName == "IMG") {
                navButton.firstElementChild.style.transitionDuration = "0.5s";

                navButton.firstElementChild.width = "0";
                navButton.firstElementChild.height = "0";

                navButton.firstElementChild.style.height = "0";
                navButton.firstElementChild.style.width = "0"; 
            }
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
        main.style.height = innerHeight - headerHeight - 10 + "px"
    }
}

/**
 * Link to object that represents _main_ tag of the document.
 */

export let main = document.querySelector("main")


let header = document.querySelector(".header");
let nav = document.querySelector("nav");

/**
 * Changes visibility of navigation buttons (to be precise, they're customized links).
 */

export function toggleNav() {
    let navLinks = nav.querySelectorAll(".nav-link");
    nav.classList.toggle("hidden");

    let heightOfNav = 0;

    for (let child of navLinks) {
        console.log(child);
        if (child.classList.contains("nav-link") && !nav.classList.contains("hidden")) {
            child.tabIndex = "0";
            heightOfNav += child.offsetHeight + parseInt(getComputedStyle(child).marginBlock);
        } else if (child.classList.contains("nav-link")) {
            child.tabIndex = "-1";
        }
    }

    nav.style.height = `${heightOfNav}px`;
}

export function changeNavHeight() {
    let navLinks = nav.querySelectorAll(".nav-link");
    let heightOfNav = 0;

    for (let child of navLinks) {
        if (child.classList.contains("nav-link") && !nav.classList.contains("hidden")) {
            heightOfNav += child.offsetHeight + parseInt(getComputedStyle(child).marginBlock);
        } 
    }

    nav.style.height = `${heightOfNav}px`;
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

export const main = document.querySelector("main")


const header = document.querySelector("header");
const nav = document.querySelector("nav");

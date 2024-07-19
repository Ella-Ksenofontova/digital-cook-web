/**
 * Changes visibility of navigation buttons (to be precise, they're customized links).
 */

export function toggleNav() {
    let navLinks = nav.querySelectorAll(".nav-link");
    nav.classList.toggle("hidden");

    let heightOfNav = 0;

    for (let child of navLinks) {
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
    let headerHeight = header.offsetHeight;

    let mainHeight = Math.max(document.body.scrollHeight, innerHeight) - headerHeight;
    main.style.height = `${mainHeight}px`;
}

/**
 * Link to object that represents _main_ tag of the document.
 */

export const main = document.querySelector("main");


const header = document.querySelector("header");
const nav = document.querySelector("nav");

/**
 * Finds chosen theme in localStorage.
 * @returns {string} - current theme chosen by user.
 */

function getStoredTheme() {
    return localStorage.getItem("theme");
}

/**
 * Tries to  find chosen theme at localStorage. If it fails, uses media queries to find out which theme does user prefer. 
 * @returns {string} - prefered theme.
 */

function getPreferedTheme() {
    let chosenTheme = getStoredTheme();

    if (chosenTheme) return chosenTheme;

    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Triggers change of page appereance (via data-attributes and CSS) to make it match with chosen theme.
 * @param {*} theme 
 */

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (getStoredTheme() != theme) localStorage.setItem("theme", theme)
}

document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getPreferedTheme());
    document.querySelector(".theme-toggler").addEventListener("click", () => {
        if (getPreferedTheme() == "light") {
            applyTheme("dark");
        } else {
            applyTheme("light");
        }
    });

});
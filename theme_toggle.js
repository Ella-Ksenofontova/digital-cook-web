function getStoredTheme() {
    return localStorage.getItem("theme");
}

function getPreferedTheme() {
    let chosenTheme = getStoredTheme();

    if (chosenTheme) return chosenTheme;

    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (getStoredTheme() != theme) localStorage.setItem("theme", theme)
}

document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getPreferedTheme());
    document.querySelector(".thumb").addEventListener("click", () => {
        if (getPreferedTheme() == "light") {
            applyTheme("dark");
        } else {
            applyTheme("light");
        }
    })
});
document.getElementById("skip-link").firstElementChild.addEventListener("focus", (e) => e.target.parentElement.classList.remove("visually-hidden"));

document.getElementById("skip-link").firstElementChild.addEventListener("blur", (e) => e.target.parentElement.classList.add("visually-hidden"));
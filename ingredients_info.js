/**
 * @file Adds a content to page with info about some little-known ingredients.
 */

import { main } from "./nav_and_main_functions.js";
import ingredientsWithInfoLinks from "./ingredients_with_info_links.js"
import { changeMainHeight } from "./nav_and_main_functions.js";

let ingredientsNames = localStorage.getItem("ingredientsNames");
let descriptions;
let dlWithIngredientsInfo;

if (ingredientsNames) {
    ingredientsNames = ingredientsNames.split(",");
    descriptions = localStorage.getItem("descriptions").split(",");

    const dialog = document.querySelector("#fullscreen-image");
    window.addEventListener("resize", () => resizeImage(dialog.querySelector("img")));
    dialog.querySelector(".close-button").addEventListener("click", () => dialog.close());

    dlWithIngredientsInfo = document.createElement("dl");
    main.append(dlWithIngredientsInfo);
    dlWithIngredientsInfo.addEventListener("click", (event) => {
        if (event.target.className === "img-of-ingredient-with-info") {
            const src = event.target.src;
            const alt = event.target.parentElement.parentElement.previousElementSibling.innerHTML;

            const img = dialog.querySelector("img");

            img.src = src;
            img.alt = alt;

            dialog.showModal();
            resizeImage(img);
        }
    });
} else {
    main.insertAdjacentHTML("beforeend", "Подходящие ингредиенты не найдены либо Вы перешли сюда не с этапа подбора ингредиентов. <br /> <a href=\"/\">На главную</a>")
}

for (let i = 0; i < ingredientsNames.length; i++) {
    let dtForIngredientName = document.createElement("dt");
    dtForIngredientName.innerHTML = ingredientsNames[i];
    dlWithIngredientsInfo.append(dtForIngredientName);

    const observer = new ResizeObserver(changeMainHeight);
    observer.observe(dlWithIngredientsInfo);

    let divForDescriptionAndPicture = document.createElement("div");
    divForDescriptionAndPicture.className = "ingredients-info-div";

    let ddForIngredientDescription = document.createElement("dd");
    ddForIngredientDescription.innerHTML = descriptions[i].replace((/\?/g), ",");
    divForDescriptionAndPicture.append(ddForIngredientDescription);

    let figureForIngredient = document.createElement("figure");

    let imgForIngredient = document.createElement("img");
    imgForIngredient.src = `./assets/Ingredients_with_info_images/${ingredientsNames[i]}.jpg`;
    imgForIngredient.alt = ingredientsNames[i];
    imgForIngredient.className = "img-of-ingredient-with-info";
    figureForIngredient.append(imgForIngredient);

    let captionOfIngredient = document.createElement("figcaption");
    captionOfIngredient.innerHTML = `<a href="${ingredientsWithInfoLinks[ingredientsNames[i]]}">Источник фото</a>`;
    figureForIngredient.append(captionOfIngredient);

    divForDescriptionAndPicture.append(figureForIngredient);

    dlWithIngredientsInfo.append(divForDescriptionAndPicture);
}

function resizeImage(image) {
    const ratio = image.naturalWidth / image.naturalHeight;

    const maxHeight = innerHeight * 0.95 - 100;
    const maxWidth = innerWidth * 0.95 - 100;

    let width = 0;
    let height = 0;

    while (true) {
        const newWidth = width + 10;
        const newHeight = width * (1 / ratio);

        if (newHeight > maxHeight || newWidth > maxWidth) break;

        width = newWidth;
        height = newHeight;
    }

    image.width = width;
    image.height = height;
}
/**
 * @file Adds a content to page with info about some little-known ingredients.
 */

import {main} from "./nav_and_main_functions.js";
import ingredientsWithInfoLinks from "./ingredients_with_info_links.js"

let dlWithIngredientsInfo = document.createElement("dl");
main.append(dlWithIngredientsInfo);

let ingredientsNames = localStorage.getItem("ingredientsNames").split(",")
let descriptions = localStorage.getItem("descriptions").split(",");

for (let i = 0; i < ingredientsNames.length; i++) {
    let dtForIngredientName = document.createElement("dt");
    dtForIngredientName.innerHTML = ingredientsNames[i];
    dlWithIngredientsInfo.append(dtForIngredientName);

    let divForDescriptionAndPicture = document.createElement("div");
    divForDescriptionAndPicture.className = "ingredients-info-div";

    let ddForIngredientDescription = document.createElement("dd");
    ddForIngredientDescription.innerHTML = descriptions[i].replace((/\?/g), ",");
    divForDescriptionAndPicture.append(ddForIngredientDescription);
    
    let figureForIngredient = document.createElement("figure");

    let imgForIngredient = document.createElement("img");
    imgForIngredient.src = `./assets/Ingredients_with_info_images/${ingredientsNames[i]}.jpg`
    imgForIngredient.height = "100";
    imgForIngredient.width = "200";
    imgForIngredient.className = "img-of-ingredient-with-info";
    figureForIngredient.append(imgForIngredient);

    let captionOfIngredient = document.createElement("figcaption");
    captionOfIngredient.innerHTML = `<a href="${ingredientsWithInfoLinks[ingredientsNames[i]]}">Источник фото</a>`;
    figureForIngredient.append(captionOfIngredient);

    divForDescriptionAndPicture.append(figureForIngredient);

    dlWithIngredientsInfo.append(divForDescriptionAndPicture);
}

function changeSizeOfImages() {
    let imagesOfIngredients = document.querySelectorAll(".img-of-ingredient-with-info");
    let figures = document.querySelectorAll("figure");
    let figcaptions = document.querySelectorAll("figcaption");

    if (innerWidth <= 625) {
        for (let i = 0; i < imagesOfIngredients.length; i++) {
            let image = imagesOfIngredients[i];
            image.height = "50";
            image.width = "100";

            let figure = figures[i];
            figure.classList.add("small");

            let figcaption = figcaptions[i];
            figcaption.classList.add("small");
        }
    } else {
        if (imagesOfIngredients[0].width == "100") {
            for (let i = 0; i < imagesOfIngredients.length; i++) {
                let image = imagesOfIngredients[i];
                image.height = "100";
                image.width = "200";

                let figure = figures[i];
                figure.classList.remove("small");

                let figcaption = figcaptions[i];
                figcaption.classList.remove("small");
            } 
        }
    }
}

window.addEventListener("resize", changeSizeOfImages)

document.addEventListener("DOMContentLoaded", changeSizeOfImages);
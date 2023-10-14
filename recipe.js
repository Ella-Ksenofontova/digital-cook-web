/**
 * Contains functions that allow to show recipes of appropriate dishes.
 * @module recipe
 */

import {DISHES} from "./dishes_presets.js";
import dishesLinks from "./dishes_links.js";

/**
 * Finds recipe of passed dish. If the dish name is not in database, throws a TypeError.
 * @throws {TypeError} When dish name is not in database.
 * @param {string} dish - name of dish
 * @returns Object with verbose list of required ingredients, cooking instructions and description (it can be undefined)
 */

function getRecipe(dish) {
    let dishInfo = DISHES.find(item => item[0].toLowerCase() === dish.toLowerCase());
    let ingredientsDetails = dishInfo[1];
    let recipe = dishInfo[2];
    let description = dishInfo[5];

    return {
        ingredientsDetails: ingredientsDetails,
        instructions: recipe,
        description: description
    };
}

/**
 * Shows pop-up with recipe of passed dish. If dish name isn't in database, throws TypeError.
 * @throws {TypeError} If dish name doesn't exist in database
 * @param {string} dish - Name of dish
 */

export function showRecipe(dish) {
    let recipe = getRecipe(dish);

    let semiTransparentFrame = document.createElement("div");
    semiTransparentFrame.className = "frame-for-pop-up";

    let recipePopUp = document.createElement("div");
    recipePopUp.className = "recipe-pop-up";
    recipePopUp.itemscope = true;
    recipePopUp.itemtype = "https://schema.org/Recipe";

    let main = document.querySelector("main");

    main.append(semiTransparentFrame);
    main.append(recipePopUp);

    addCloseButton(recipePopUp);

    let title = document.createElement("h1");
    title.className = "recipe-title";
    title.innerHTML = dish;
    recipePopUp.append(title);

    if (recipe.description) recipePopUp.insertAdjacentHTML("beforeend", `<span itemprop="description"><i>${recipe.description}</i><span><br>`);
        
    addYouNeedTitle();
    addDishFigure(dish);

    let ingredientsDetails = recipe.ingredientsDetails.split("\n");
    addListItems(ingredientsDetails);

    addInstructionsTitle();

    let instructions = recipe.instructions.split("\n");
    addListItems(instructions);  
}

/**
 * Adds title "You need" (ru: Вам понадобится) to pop-up. Used in _showRecipe_ function.
 * @see showRecipe
 */

function addYouNeedTitle() {
    let recipePopUp = document.querySelector(".recipe-pop-up");

    let youNeedTitle = document.createElement("div");
    youNeedTitle.className = "recipe-title";
    youNeedTitle.innerHTML = "Вам понадобится:";
    recipePopUp.append(youNeedTitle);
}

/**
 * Adds title "Recipe" (ru: Рецепт) to pop-up. Used in _showRecipe_ function.
 * @see showRecipe
 */

function addInstructionsTitle() {
    let recipePopUp = document.querySelector(".recipe-pop-up");

    let instructionsTitle = document.createElement("div");
    instructionsTitle.className = "instrucrtions-title";
    instructionsTitle.innerHTML = "Рецепт:"
    recipePopUp.append(instructionsTitle);
}

/**
 * Adds close button to pop-up. Used in _showRecipe_ function.
 * @see showRecipe
 */

function addCloseButton() {
    let recipePopUp = document.querySelector(".recipe-pop-up");

    let closeButton = document.createElement("button");
    closeButton.className = "close-button";
    recipePopUp.append(closeButton);

    closeButton.addEventListener("click", closeRecipePopUp);
}

/**
 * Closes pop-up with recipe. It's and event handler for click to close button.
 */

function closeRecipePopUp() {
    let recipePopUp = document.querySelector(".recipe-pop-up");
    recipePopUp.remove();

    let semiTransparentFrame = document.querySelector(".frame-for-pop-up");
    semiTransparentFrame.remove();
}

/**
 * Adds figure with dish image and link to its source as a caption. Used in _showRecipe_ function.
 * @see showRecipe
 */

function addDishFigure(dishName) {
    let recipePopUp = document.querySelector(".recipe-pop-up");

    let dishFigure = document.createElement("figure");
    dishFigure.className = "recipe";

    if ( dishName.includes('"') ) {
        dishName = dishName.replace(/"/g, "");
    }
    let dishImageSrc = `./assets/Dish_images/${dishName}.jpg`;

    let dishImage = document.createElement("img");
    dishImage.src = dishImageSrc;
    dishImage.itemprop = "image";
    dishImage.height = "100";
    dishImage.width = "200";
    dishImage.className = "img-of-dish";

    dishFigure.append(dishImage);

    let caption = document.createElement("figcaption");
    caption.className = "recipe";
    caption.innerHTML = `<a href="${dishesLinks[dishName]}">Источник фото</a>`;
    dishFigure.append(caption);

    recipePopUp.append(dishFigure);
}

/**
 * Adds item of list (for example, list of cooking instructions) to pop-up. Used in _showRecipe_ function.
 * @see showRecipe
 */

function addListItems(list, typeOfList) {
    let recipePopUp = document.querySelector(".recipe-pop-up");
    let divForItems = document.createElement("div");
    if (typeOfList == "instructions") {
        divForItems.itemprop = "instructions";
    }
    recipePopUp.append(divForItems);

    for (let listItem of list) {
        if (typeOfList == "instructions") {
            divForItems.append(listItem);
        } else {
            divForItems.insertAdjacentHTML("beforeend", `<span itemprop="recipeIngredient">${listItem}</span>`)
        }
        divForItems.append(document.createElement("br"));
    }
}

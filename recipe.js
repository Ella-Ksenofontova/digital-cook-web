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
    const dishInfo = DISHES.find(item => item[0].toLowerCase() === dish.toLowerCase());
    const ingredientsDetails = dishInfo[1];
    const recipe = dishInfo[2];
    const description = dishInfo[5];

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
    const recipe = getRecipe(dish);

    const semiTransparentFrame = document.createElement("div");
    semiTransparentFrame.className = "frame-for-pop-up";

    const outer = document.createElement("div");
    outer.classList.add("outer");

    const recipePopUp = document.createElement("div");
    recipePopUp.className = "recipe-pop-up";
    recipePopUp.id = "recipe-pop-up";

    const main = document.querySelector("main");

    main.append(semiTransparentFrame);
    main.append(outer);
    outer.append(recipePopUp);

    addCloseButton(recipePopUp);

    const title = document.createElement("div");
    title.className = "recipe-title";
    title.innerHTML = dish;
    recipePopUp.append(title);

    if (recipe.description) recipePopUp.insertAdjacentHTML("beforeend", `<span><i>${recipe.description}</i><span><br>`);
        
    addYouNeedTitle();
    addDishFigure(dish);

    const ingredientsDetails = recipe.ingredientsDetails.split("\n");
    addListItems(ingredientsDetails);

    addInstructionsTitle();

    const instructions = recipe.instructions.split("\n");
    addListItems(instructions); 
}

/**
 * Adds title "You need" (ru: Вам понадобится) to pop-up. Used in _showRecipe_ function.
 * @see showRecipe
 */

function addYouNeedTitle() {
    const recipePopUp = document.querySelector(".recipe-pop-up");

    const youNeedTitle = document.createElement("div");
    youNeedTitle.className = "you-need-title";
    youNeedTitle.innerHTML = "Вам понадобится:";
    recipePopUp.append(youNeedTitle);
}

/**
 * Adds title "Recipe" (ru: Рецепт) to pop-up. Used in _showRecipe_ function.
 * @see showRecipe
 */

function addInstructionsTitle() {
    const recipePopUp = document.querySelector(".recipe-pop-up");

    const instructionsTitle = document.createElement("div");
    instructionsTitle.className = "instructions-title";
    instructionsTitle.innerHTML = "Рецепт:"
    recipePopUp.append(instructionsTitle);
}

/**
 * Adds close button to pop-up. Used in _showRecipe_ function.
 * @see showRecipe
 */

function addCloseButton() {
    const recipePopUp = document.querySelector(".recipe-pop-up");

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.insertAdjacentHTML("beforeend", "<span class=\"visually-hidden\">Закрыть</span>")
    recipePopUp.append(closeButton);

    closeButton.addEventListener("click", closeRecipePopUp);
}

/**
 * Closes pop-up with recipe. It's and event handler for click to close button.
 */

function closeRecipePopUp() {
    const outer = document.querySelector(".outer");
    outer.remove();

    const semiTransparentFrame = document.querySelector(".frame-for-pop-up");
    semiTransparentFrame.remove();
}

/**
 * Adds figure with dish image and link to its source as a caption. Used in _showRecipe_ function.
 * @param {string} dishName - Name of the dish.
 * @see showRecipe
 */

function addDishFigure(dishName) {
    const recipePopUp = document.querySelector(".recipe-pop-up");

    const dishFigure = document.createElement("figure");
    dishFigure.className = "recipe";

    if ( dishName.includes('"') ) {
        dishName = dishName.replace(/"/g, "");
    }
    const dishImageSrc = `./assets/Dish_images/${dishName}.jpg`;

    const dishImage = document.createElement("img");
    dishImage.src = dishImageSrc;
    dishImage.height = "100";
    dishImage.width = "200";
    dishImage.className = "img-of-dish";
    dishImage.alt = dishName;

    dishFigure.append(dishImage);

    const caption = document.createElement("figcaption");
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
    const recipePopUp = document.querySelector(".recipe-pop-up");
    const divForItems = document.createElement("div");
    recipePopUp.append(divForItems);

    for (const listItem of list) {
        if (typeOfList == "instructions") {
            divForItems.append(listItem);
        } else {
            divForItems.insertAdjacentHTML("beforeend", `<span>${listItem}</span>`)
        }
        divForItems.append(document.createElement("br"));
    }
}

/**
 * Removes menu of dish types.
 */
export function removeDishTypesMenu() {
    let runtimeForm = document.getElementById("runtime-form");
	let dishTypesCheckboxes = runtimeForm.querySelectorAll("[id^=dish-type-checkbox]");
    let dishTypeBreaks = runtimeForm.querySelectorAll("[id^=dish-type-br]");

    for (let i = 0; i < dishTypesCheckboxes.length; i++) {
		let textNearCheckbox = dishTypesCheckboxes[i].nextSibling;
        
        textNearCheckbox.remove();
        dishTypesCheckboxes[i].remove();
        dishTypeBreaks[i].remove();
    }
}

/**
 * Adds search field that allows to find ingredients to the screen.
 */

export function addSearchField() {
let searchField = document.createElement("input");
searchField.type = "text";
searchField.placeholder = "Искать ингредиенты"
searchField.className = "search-field";

let runtimeForm = document.getElementById("runtime-form");
runtimeForm.prepend(searchField);

searchField.addEventListener("input", findMatchingIngredients);
}

/**
* Makes ingredients that don't match text in search field invisible.
* @param {InputEvent} event - event object (it should be _input_ event)
*/

export function findMatchingIngredients(event) {
    let query = event.target.value.toLowerCase();
    let ingredientCheckboxes = document.querySelectorAll("[id^=ingredient-checkbox]");

    for(let checkbox of ingredientCheckboxes) {
        let textNearCheckbox = checkbox.nextSibling.innerHTML;
        if (!textNearCheckbox.toLowerCase().startsWith(query)) {
            checkbox.hidden = true;
            checkbox.nextSibling.hidden = true;
        } else if (checkbox.hidden) {
            checkbox.hidden = false;
            checkbox.nextSibling.hidden = false;
        }
    }

    changeChooseAllButtonsVisibility();
}

function changeChooseAllButtonsVisibility() {
    let chooseAllButtons = document.querySelectorAll(".choose-all-button");
    for (let chooseAllButton of chooseAllButtons) {
        let firstCheckboxOfCategory = chooseAllButton.nextElementSibling;
        let checkboxesOfCategory = getCheckboxesAndButtonOfCategory(firstCheckboxOfCategory).checkboxes;

        let visibilityOfCheckboxes = checkboxesOfCategory.map(item => item.hidden);
        if (visibilityOfCheckboxes.includes(true)) {
            chooseAllButton.hidden = true;
            chooseAllButton.insertAdjacentHTML("afterend", "<div class='placeholder'></div>");
        } else if (chooseAllButton.hidden) {
            chooseAllButton.hidden = false;
            let placeholder = document.querySelector(".placeholder");
            placeholder.remove();
        }
    }
}

/**
 * Creates _h3_ tag with name of ingredient category.
 * @param {string[]} ingredientsCategories - array with categories of ingredients
 * @param {number} ingredientCategoryNumber - index of category in this array
 * @param {string[][]} appropriateIngredients - array with appropriate ingredients sorted by their category
 */

export function createIngredientsCategoryTitle(ingredientsCategories, ingredientCategoryNumber, appropriateIngredients) {
    let ingredientsContainer = document.querySelector(".ingredients-container");
	let ingredientCategoryTitle = document.createElement("h3");
    ingredientCategoryTitle.id = "ingredients-category" + (ingredientCategoryNumber + 1);
    ingredientCategoryTitle.innerHTML = ingredientsCategories[ingredientCategoryNumber];
    ingredientCategoryTitle.className = "ingredient-category-title";
    ingredientsContainer.append(ingredientCategoryTitle);

    let ingredientsOfCategory = appropriateIngredients[ingredientCategoryNumber];

     if (ingredientsOfCategory.length > 0) {
        let chooseAllButton = document.createElement("button");
        chooseAllButton.type = "button";
        chooseAllButton.className = "choose-all-button";
        chooseAllButton.innerHTML = "Выбрать всё";

        ingredientsContainer.append(chooseAllButton);
     }  
}

/**
 * Makes checkboxes that were hidden when menu of ingredients exlusion was shown (it is made to avoid contradictions) visible.
 */

export function showHiddenCheckboxes() {
    let checkboxes = document.querySelectorAll("[id^=ingredient-checkbox]");
    for (let checkbox of checkboxes) {
        if (checkbox.hidden) {
            checkbox.hidden = false;
            checkbox.nextElementSibling.hidden = false;
         }
    }
}

/**
 * Chooses or unselects all ingredients from corresponding category.
 * @param {(MouseEvent|PointerEvent)} event - event object. Event should be either click, pointerdown or pointerup
 */

export function toggleAllFromCategory(event) {
    if (event.target.className == "choose-all-button") {
        let chooseAllButton = event.target;
        let nextElem = chooseAllButton.nextElementSibling;

        while(nextElem?.tagName != "H3" && nextElem) {
            if (nextElem.tagName == "INPUT" && chooseAllButton.innerHTML == "Выбрать всё") {
                nextElem.checked = true;
            } else if (nextElem.tagName == "INPUT" && chooseAllButton.innerHTML == "Отменить выбор") {
                nextElem.checked = false;
            }
            nextElem = nextElem.nextElementSibling;
        }

        if (chooseAllButton.innerHTML == "Выбрать всё") {
            chooseAllButton.innerHTML = "Отменить выбор";
        } else {
            chooseAllButton.innerHTML = "Выбрать всё";
        }
    }
}

export function changeChooseAllButtonText(event) {
    if (event.target.className == "ingredient-checkbox") {
        let currentCheckbox = event.target;
        let elementsOfCategory = getCheckboxesAndButtonOfCategory(currentCheckbox);

        let statesOfCheckboxes = elementsOfCategory.checkboxes.map(item => item.checked);

        if (!statesOfCheckboxes.includes(true) && elementsOfCategory.chooseAllButton.innerHTML == "Отменить выбор") {
            elementsOfCategory.chooseAllButton.innerHTML = "Выбрать всё";
        } else if (!statesOfCheckboxes.includes(false) && elementsOfCategory.chooseAllButton.innerHTML == "Выбрать всё") {
            elementsOfCategory.chooseAllButton.innerHTML = "Отменить выбор";
        }
    }
}

function getCheckboxesAndButtonOfCategory(currentCheckbox) {
    let checkboxes = [currentCheckbox];
    let nextElem = currentCheckbox.nextElementSibling;
        while(nextElem?.tagName != "H3" && nextElem) {
            if (nextElem.tagName == "INPUT") {
                checkboxes.push(nextElem);
            }

            nextElem = nextElem.nextElementSibling;
        }

    let previousElem = currentCheckbox.previousElementSibling;
    let chooseAllButton;
    while(previousElem.tagName != "H3") {
        if (previousElem.tagName == "INPUT") {
                checkboxes.push(previousElem);
        } else if (previousElem.tagName == "BUTTON") {
            chooseAllButton = previousElem;
        }

            previousElem = previousElem.previousElementSibling;
        }
    
    return {
        chooseAllButton: chooseAllButton,
        checkboxes: checkboxes
    };
}

/**
 * Adds message that there's no appropriate ingredients of this category.
 */

export function addNoIngredientsTitle() {
    let ingredientsContainer = document.querySelector(".ingredients-container");
	let noIngredientsTitle = document.createElement("div");
    noIngredientsTitle.className = ("no-ingredients-title");
    noIngredientsTitle.innerHTML = "Нет ингредиентов из этой категории";
    ingredientsContainer.append(noIngredientsTitle);
}

/**
 * Adds checkboxes with ingredients of this category on the screen.
 * @param {string[]} ingredientsOfCategory - array with ingredients of category
 */

export function addIngredientsOfCategory(ingredientsOfCategory) {
    let ingredientsContainer = document.querySelector(".ingredients-container");
	for (let ingredientNumber = 0; ingredientNumber < ingredientsOfCategory.length; ingredientNumber++) {

        let ingredientCheckbox = document.createElement("input");
        ingredientCheckbox.type = "checkbox";
        ingredientCheckbox.className = "ingredient-checkbox";
        ingredientCheckbox.id = "ingredient-checkbox: " + ingredientsOfCategory[ingredientNumber];;
        ingredientsContainer.append(ingredientCheckbox);

        let ingredientName = document.createElement("label");
        ingredientName.className = "ingredient-name";
        ingredientName.htmlFor = `${ingredientCheckbox.id}`;
        ingredientName.innerHTML = ingredientsOfCategory[ingredientNumber];
        ingredientsContainer.append(ingredientName);	
    }
}
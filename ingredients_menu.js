/**
 * Removes menu of dish types.
 */
export function removeDishTypesMenu() {
    let runtimeForm = document.getElementById("runtime-form");
	let dishTypesCheckboxes = runtimeForm.querySelectorAll("[id^=dish-type-checkbox]");
    let pseudoCheckboxes = runtimeForm.querySelectorAll(".pseudo-checkbox");
    let dishTypeBreaks = runtimeForm.querySelectorAll("[id^=dish-type-br]");

    for (let i = 0; i < dishTypesCheckboxes.length; i++) {
		let textNearCheckbox = pseudoCheckboxes[i].nextElementSibling;
        
        textNearCheckbox.remove();
        pseudoCheckboxes[i].remove();
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
        let textNearCheckbox = checkbox.nextElementSibling.nextElementSibling.innerHTML;
        if (!textNearCheckbox.toLowerCase().startsWith(query)) {
            checkbox.hidden = true;
            checkbox.nextSibling.classList.add("hidden");
            checkbox.nextElementSibling.nextElementSibling.hidden = true;
        } else if (checkbox.hidden) {
            checkbox.hidden = false;
            checkbox.nextSibling.classList.remove("hidden");
            checkbox.nextElementSibling.nextElementSibling.hidden = false;
        }
    }

    changeChooseAllDivVisibility();
}

function changeChooseAllDivVisibility() {
    let chooseAllDivs = document.querySelectorAll(".choose-all-div");
    for (let i = 0; i < chooseAllDivs.length; i++) {
        let chooseAllDiv = chooseAllDivs[i];
        let firstCheckboxOfCategory = chooseAllDiv.nextElementSibling;
        let checkboxesOfCategory = getCheckboxesAndCheckboxOfCategory(firstCheckboxOfCategory).checkboxes;

        let visibilityOfCheckboxes = checkboxesOfCategory.map(item => item.hidden);
        if (visibilityOfCheckboxes.includes(true)) {
            chooseAllDiv.hidden = true;
            let placeholder = document.querySelector(`#placeholder${i + 1}`);
            if (!placeholder) {
                chooseAllDiv.insertAdjacentHTML("afterend", `<div id="placeholder${i + 1}"></div>`);
            }
        } else if (chooseAllDiv.hidden) {
            chooseAllDiv.hidden = false;
            let placeholder = document.querySelector(`#placeholder${i + 1}`);
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
        let chooseAllDiv = document.createElement("div");
        chooseAllDiv.className = "choose-all-div";

        let chooseAllCheckbox = document.createElement("input");
        chooseAllCheckbox.type = "checkbox";
        chooseAllCheckbox.className = "choose-all-checkbox";
        chooseAllCheckbox.id = `choose-all-checkbox${ingredientCategoryNumber}`;

        let chooseAllPseudoCheckbox = document.createElement("div");
        chooseAllPseudoCheckbox.className = "pseudo-checkbox";

        chooseAllDiv.append(chooseAllCheckbox);
        chooseAllDiv.append(chooseAllPseudoCheckbox);

        let chooseAllLabel = document.createElement("label");
        chooseAllLabel.htmlFor = `choose-all-checkbox${ingredientCategoryNumber}`;
        chooseAllLabel.innerHTML = "Все";
        chooseAllDiv.append(chooseAllLabel)

        ingredientsContainer.append(chooseAllDiv)
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
            checkbox.nextElementSibling.classList.remove("hidden");
            checkbox.nextElementSibling.nextElementSibling.hidden = false;
         }
    }

    let chooseAllDivs = document.querySelectorAll(".choose-all-div");
        for (let chooseAllDiv of chooseAllDivs) {
            if (chooseAllDiv.firstElementChild.checked) {
                chooseAllDiv.classList.remove("hidden");
                chooseAllDiv.firstElementChild.checked = false;
            }
        }
}

/**
 * Chooses or unselects all ingredients from corresponding category.
 * @param {(MouseEvent|PointerEvent)} event - event object. Event should be either click, pointerdown or pointerup
 */

export function toggleAllFromCategory(event) {
    if (event.target.parentElement?.className === "choose-all-div") {
        let chooseAllElem = event.target;
        let chooseAllCheckbox = event.target.parentElement.querySelector(".choose-all-checkbox");
        let nextElem = chooseAllElem.parentNode.nextElementSibling;

        while(nextElem?.tagName != "H3" && nextElem) {
            if (nextElem.tagName == "INPUT" && chooseAllCheckbox.checked) {
                nextElem.checked = true;
            } else if (nextElem.tagName == "INPUT" && !chooseAllCheckbox.checked) {
                nextElem.checked = false;
            }
            nextElem = nextElem.nextElementSibling;
        }
    }
}

function getCheckboxesAndCheckboxOfCategory(currentCheckbox) {
    let checkboxes = [currentCheckbox];
    let nextElem = currentCheckbox.nextElementSibling;
        while(nextElem?.tagName != "H3" && nextElem) {
            if (nextElem.tagName == "INPUT") {
                checkboxes.push(nextElem);
            }

            nextElem = nextElem.nextElementSibling;
        }

    let previousElem = currentCheckbox.previousElementSibling;
    let chooseAllCheckbox;
    while(previousElem.tagName != "H3") {
        if (previousElem.tagName == "INPUT") {
                checkboxes.push(previousElem);
        } else if (previousElem.tagName == "DIV") {
            chooseAllCheckbox = previousElem.querySelector(".choose-all-checkbox");
        }

            previousElem = previousElem.previousElementSibling;
        }
    
    return {
        chooseAllCheckbox: chooseAllCheckbox,
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
        ingredientCheckbox.id = "ingredient-checkbox: " + ingredientsOfCategory[ingredientNumber];

        let ingredientPseudoCheckbox = document.createElement("div");
        ingredientPseudoCheckbox.className = "pseudo-checkbox";

        ingredientsContainer.append(ingredientCheckbox);
        ingredientsContainer.append(ingredientPseudoCheckbox);

        let ingredientName = document.createElement("label");
        ingredientName.className = "ingredient-name";
        ingredientName.htmlFor = `${ingredientCheckbox.id}`;
        ingredientName.innerHTML = ingredientsOfCategory[ingredientNumber];
        ingredientsContainer.append(ingredientName);	
    }
}
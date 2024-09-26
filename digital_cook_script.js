import {PRESETS} from "./presets.js";
import {DISHES} from "./dishes_presets.js";
import {INGREDIENTS} from "./ingredients_presets.js";
import { INGREDIENTS_INFO } from "./ingredients_info_presets.js";

import {removeDishTypesMenu, addSearchField, showHiddenCheckboxes, createIngredientsCategoryTitle, addNoIngredientsTitle, addIngredientsOfCategory, toggleAllFromCategory} from "./ingredients_menu.js";
import {showRecipe} from "./recipe.js";
import {changeMainHeight, toggleNav, changeNavHeight, main} from "./nav_and_main_functions.js";

function toggleCheckbox(event) {
    const target = event.target;
    if(target.classList.contains("pseudo-checkbox")) {
        const checkbox = target.previousElementSibling;
        checkbox.checked = !checkbox.checked;
    }
}

/**
 *Class that represents Digital Cook app. It contains neccessary methods and fields for the main part of application to work.
 * @class
 */
export class App {
    constructor() {
        this.chosenCuisines = [];
        this.chosenDishTypes = [];
        this.chosenIngredients = [];
        this.excludedIngredients = [];

        this.showCuisinesMenu = this.showCuisinesMenu.bind(this);
        this.makeSecondStep = this.makeSecondStep.bind(this);
        this.makeThirdStep = this.makeThirdStep.bind(this);
        this.finalize = this.finalize.bind(this);
        this.showRecipeIfFound = this.showRecipeIfFound.bind(this);
        this.start = this.start.bind(this);
    }

    /**
     * Adds initial event listeners to page elements. 
     */

    start() {
        let startButton = document.getElementById("start");
        let menu = document.querySelector(".menu-button");
        
        menu.onclick = toggleNav;

        window.addEventListener("click", function(event) {
            if (event.target.tagName != "NAV" && !event.target.classList.contains("menu-button") && !document.querySelector("nav").classList.contains("hidden")) {
                if (window.matchMedia("min-width: 500px").matches) {
                    setTimeout(() => toggleNav(), 500);
                } else {
                    toggleNav();
                }
            }
        });

        window.addEventListener("resize", changeNavHeight);
        
        window.addEventListener("resize", changeMainHeight);
        document.addEventListener("DOMContentLoaded", changeMainHeight);
        document.body.addEventListener("click", toggleCheckbox);

        startButton.onclick = () => this.showCuisinesMenu(false);
    }

    /**
     * Shows menu of cuisines.
     * @param {boolean} [fromFollowing=false] - whether the method  was called after user clicked back button under dish types menu
     */

    showCuisinesMenu(fromFollowing=false) {
        if (fromFollowing){
            this.cleanUpForCuisinesMenuFromFollowing();
        } else {
            this.cleanUpForCuisinesMenu();
        }
        let continueButton = document.getElementById("continue");
        let runtimeForm = document.getElementById("runtime-form");

        let cuisines = PRESETS.cuisines;

        this.addCuisines(cuisines, continueButton);

        runtimeForm.onsubmit = this.makeSecondStep;
        runtimeForm.onkeydown = event => {
            if (event.code == "Enter") {
                event.preventDefault;
            }
        }

        changeMainHeight();
    }

    /**
     * Cleans up the screen (to be precise, _main_ tag). This method is called if user clicked start button, which is placed in the screen when the app is initialized.
     */

    cleanUpForCuisinesMenu() {
        main.style.textAlign = "left";

        let startButton = document.getElementById("start");
        startButton.remove();
        const findDishesButton = document.querySelector("#find-dishes");
        findDishesButton.remove();
        const dishesFinder = document.querySelector(".dishes-finder");
        dishesFinder.remove();

        let runtimeTitle = document.createElement("h2");
        runtimeTitle.id = "runtime-title";
        runtimeTitle.innerHTML = "Блюда каких кухонь вам нравятся?";
        main.append(runtimeTitle);

        let runtimeForm = document.createElement("form");
        runtimeForm.id = "runtime-form";

        main.append(runtimeForm);

        let continueButton = document.createElement("input");
        continueButton.type = "submit";
        continueButton.id = "continue";
        continueButton.value = "Продолжить";

        runtimeForm.append(continueButton);
    }

    /**
     * Cleans up the screen (to be precise, _main_ tag). Unlike _cleanUpForCuisinesMenu_ method, this method is called when user opened cuisines menu from following dish types menu.
     */

    cleanUpForCuisinesMenuFromFollowing() {
        let runtimeTitle = document.getElementById("runtime-title");
        runtimeTitle.innerHTML = "Блюда каких кухонь вам нравятся?";

        let runtimeForm = document.getElementById("runtime-form");
        let dishTypesCheckboxes = runtimeForm.querySelectorAll("[id^=dish-type-checkbox]");
        let dishTypesBreaks = runtimeForm.querySelectorAll("[id^=dish-type-br]");
        let pseudoCheckboxes = runtimeForm.querySelectorAll(".pseudo-checkbox");

        for (let i = 0; i < dishTypesCheckboxes.length; i++) {
            let textNearCheckbox = pseudoCheckboxes[i].nextElementSibling;
            textNearCheckbox.remove();
            pseudoCheckboxes[i].remove();
            dishTypesCheckboxes[i].remove();
            dishTypesBreaks[i].remove();
        }

        let backButton = document.getElementById("back-button");
        backButton.remove();
    }

    /**
     * Adds checboxes with cuisines on the screen.
     * @param {String[]} cuisines - list of all cuisines available in app
     * @param {HTMLInputElement} continueButton - input with type "submit" click to which implements transition to next step of program
     */

    addCuisines(cuisines, continueButton) {
        for (let cuisineNumber = 1; cuisineNumber <= cuisines.length; cuisineNumber++) {
            let cuisineCheckbox = document.createElement("input");
            cuisineCheckbox.type = "checkbox";
            cuisineCheckbox.id = "cuisine-checkbox" + cuisineNumber;

            let cuisinePseudoCheckbox = document.createElement("div");
            cuisinePseudoCheckbox.className = "pseudo-checkbox";

            continueButton.before(cuisineCheckbox);
            continueButton.before(cuisinePseudoCheckbox);

            let cuisineLabel = document.createElement("label");
            cuisineLabel.innerHTML = cuisines[cuisineNumber - 1]
            cuisineLabel.htmlFor = `${cuisineCheckbox.id}`;
            continueButton.before(cuisineLabel);

            let cuisineBr = document.createElement("br");
            cuisineBr.id = "cuisine-br" + cuisineNumber;

            continueButton.before(cuisineBr);
        }
    }

    /**
     * Adds labels (that correspond to cuisines' names) of checked checkboxes in array, then assigns this array to class field.
     */

    analyseCuisines() {
        let runtimeForm = document.getElementById("runtime-form");

        let cuisinesCheckboxes = runtimeForm.querySelectorAll("[id^=cuisine-checkbox]");
        let chosenCuisines = [];

        for (let cuisineCheckbox of cuisinesCheckboxes) {
            if (cuisineCheckbox.checked) {
                let cuisine = cuisineCheckbox.nextElementSibling.nextElementSibling.innerHTML;
                chosenCuisines.push(cuisine);
            }
        }

        this.chosenCuisines = chosenCuisines;
    }

    /**
     * Shows menu of dish types.
     * @param {boolean} fromFollowing - Whether the method was called after user clicked back button under ingredients menu
     */

    showTypesMenu(fromFollowing=false) {
        let runtimeTitle = document.getElementById("runtime-title");
        runtimeTitle.innerHTML = "Блюда каких категорий вы хотите?"

        let runtimeForm = document.getElementById("runtime-form");
        let continueButton = document.getElementById("continue");
        
        if (fromFollowing) {
            this.cleanUpForTypesMenuFromFollowing(runtimeForm);
            document.getElementById("back-button").onclick = () => this.showCuisinesMenu(true);
        } else {
            this.cleanUpForTypesMenu(runtimeForm, continueButton);
            this.addBackButton(continueButton);
            document.getElementById("back-button").onclick = () => this.showCuisinesMenu(true);
        }

        this.addDishTypes();

        runtimeForm.onsubmit = this.makeThirdStep;
        changeMainHeight();
    }

    /**
     * Adds checkboxes with dish types on the screen.
     */

    addDishTypes() {
        let backButton = document.getElementById("back-button");
        let dishesTypes = PRESETS.dishesTypes;

        for (let dishTypeNumber = 1; dishTypeNumber <= dishesTypes.length; dishTypeNumber++) {
            let dishTypeCheckbox = document.createElement("input");
            dishTypeCheckbox.type = "checkbox";
            dishTypeCheckbox.id = "dish-type-checkbox" + dishTypeNumber;

            let typePseudoCheckbox = document.createElement("div");
            typePseudoCheckbox.className = "pseudo-checkbox";

            backButton.before(dishTypeCheckbox);
            backButton.before(typePseudoCheckbox);

            let dishTypeLabel = document.createElement("label");
            dishTypeLabel.htmlFor = `${dishTypeCheckbox.id}`;
            dishTypeLabel.innerHTML = dishesTypes[dishTypeNumber - 1];
            backButton.before(dishTypeLabel);

            let dishTypeBr = document.createElement("br");
            dishTypeBr.id = "dish-type-br" + dishTypeNumber;

            backButton.before(dishTypeBr);
        }
    }

    /**
     * Cleans up the screen (to be precise, _main_ tag). This method is called when user's click on **continue** button has triggered show of dish types menu.
     * @param {*} runtimeForm 
     */

    cleanUpForTypesMenu(runtimeForm) {
        let cuisinesCheckboxes = runtimeForm.querySelectorAll("[id^=cuisine-checkbox]");
        let cuisinesBreaks = runtimeForm.querySelectorAll("[id^=cuisine-br]");
        let pseudoCheckboxes = runtimeForm.querySelectorAll(".pseudo-checkbox");

        for (let i = 0; i < cuisinesCheckboxes.length; i++) {
            let textNearCheckbox = pseudoCheckboxes[i].nextElementSibling;
            textNearCheckbox.remove();
            pseudoCheckboxes[i].remove();
            cuisinesCheckboxes[i].remove();
            cuisinesBreaks[i].remove();
        }
    }

    /**
     * Cleans up the screen (to be precise, _main_ tag). Unlike _cleanUpForTypesMenu_ method, this method is called when user's click on **back** button has triggered show of dish types menu.
     */

    cleanUpForTypesMenuFromFollowing() {
        let ingredientsCategoryTitles = document.querySelectorAll(".ingredient-category-title");
        let appropriateIngredients = this.appropriateIngredients;
        let ingredientsInfo = document.getElementById("ingredients-info");
        if (ingredientsInfo) ingredientsInfo.remove();
        let searchField = document.querySelector(".search-field");
        searchField.remove();

        for (let indexOfCategory = 0; indexOfCategory < ingredientsCategoryTitles.length; indexOfCategory++) {
            ingredientsCategoryTitles[indexOfCategory].remove();
            let appropriateIngredientsFromCategory = appropriateIngredients[indexOfCategory];

            if (appropriateIngredientsFromCategory.length == 0) {
                let noIngredientsTitle = document.querySelector(".no-ingredients-title");
                noIngredientsTitle.remove();
            } else {
                let chooseAllDiv = document.querySelector(".choose-all-div");
                chooseAllDiv.remove();
            }     
        }

        let checkboxes = document.querySelectorAll("[id^=ingredient-checkbox]");
        let pseudoCheckboxes = document.querySelectorAll(".pseudo-checkbox");
            for (let i = 0; i < checkboxes.length; i++) {
                let textNearCheckbox = pseudoCheckboxes[i].nextSibling;
                checkboxes[i].remove();
                textNearCheckbox.remove();
                pseudoCheckboxes[i].remove();
        }
    }

    /**
     * Adds back button to the screen.
     * @param {HTMLInputElement} continueButton - button click to which implements transition to the next step of program. If it exists, back button is placed before it, otherwise it is placed under list of dishes
     */
    addBackButton(continueButton=null) {
        let backButton = document.createElement("button");
        backButton.id = "back-button";
        backButton.innerHTML = "Назад";
        backButton.type = "button";

        if (continueButton) {
            continueButton.before(backButton);
        } else {
            backButton.onclick = () => this.showIngredientsMenu(true);
            let dishesContainer = document.querySelector(".dishes-container");
            if (dishesContainer) {
                dishesContainer.append(backButton);
            } else {
                main.append(backButton);
            }
        }
    }

    /**
     * Makes a list of chosen cuisines and shows dish types menu.
     * @param {(PointerEvent|MouseEvent)} event - object of event (event should be either click, pointerup or pointerdown)
     * @see analyseCuisines
     * @see showTypesMenu
     */

    makeSecondStep(event) {
        event.preventDefault();
        this.analyseCuisines.call(this);
        this.showTypesMenu();
    }

    /**
     * Adds labels (that correspond to names of dishes types) of checked checkboxes in array, then assigns this array to class field.
     */

    analyseDishesTypes() {
        let runtimeForm = document.getElementById("runtime-form");

        let dishTypesChecboxes = runtimeForm.querySelectorAll("[id^=dish-type-checkbox]");
        let chosenDishTypes = [];

        for (let dishTypeCheckbox of dishTypesChecboxes) {
            if (dishTypeCheckbox.checked) {
                let dishType = dishTypeCheckbox.nextElementSibling.nextElementSibling.innerHTML;
                chosenDishTypes.push(dishType);
            }
        }

        this.chosenDishTypes = chosenDishTypes;
    }

    /**
     * Finds appropriate ingredients according to cuisines and dish types chosen by user.
     * @returns {String[][]} 2-dimensional array with ingredients grouped by categories
     */

    getAppropriateIngredients() {
        let appropriateIngredients = [[], [], [], [], [], [], [], []];

        let ingredientsCategories = PRESETS.ingredientsCategories;

        for (let ingredient of INGREDIENTS) {
            let usageOfIngredient = ingredient[1];

            if (usageOfIngredient) {
                usageOfIngredient = usageOfIngredient.split("; ")

                for (let nameOfDishWithIngredient of usageOfIngredient) {
                    let dishType, cuisine;
                    let dishInfo = DISHES.find((item) => item[0].toLowerCase() == nameOfDishWithIngredient.toLowerCase());

                    if(dishInfo) {
                        dishType = dishInfo[3];
                        cuisine = dishInfo[4];
                    }

                    if (this.chosenDishTypes.includes(dishType) && this.chosenCuisines.includes(cuisine)) {
                        let categoryOfIngredient = ingredient[3];
                        let indexOfCategory = ingredientsCategories.indexOf(categoryOfIngredient);

                        let ingredientName = ingredient[0];

                        appropriateIngredients[indexOfCategory].push(ingredientName);

                        break;
                    }
                }
            }
        }

        return appropriateIngredients;
    }

    /**
     * Shows menu of ingredients.
     * @param {boolean} fromFollowing - whether method was called after user clicked back button (not under menu of ingredients exclusion)
     * @param {boolean} fromExcludeMenu - whether method was called after used clicked back button under menu of ingredients exclusion
     */

    showIngredientsMenu(fromFollowing=false, fromExcludeMenu=false) {
        let runtimeTitle = document.getElementById("runtime-title");
        runtimeTitle.innerHTML = "Какие ингредиенты вам нравятся?"

        this.cleanUpForIngredientsMenu(fromFollowing, fromExcludeMenu);
        
        let backButton = document.getElementById("back-button");
        this.appropriateIngredients = this.getAppropriateIngredients();

        if(!fromExcludeMenu) addSearchField();

        let numberOfIngredientsWithInfo = this.getIngredientsWithInfo().ingredientsNames.length;    
        if (numberOfIngredientsWithInfo) {   
            this.addLinkToIngredientsInfo();
        }

        let ingredientsContainer = document.querySelector(".ingredients-container");

        if(!ingredientsContainer) {
            ingredientsContainer = document.createElement("div");
            ingredientsContainer.className = "ingredients-container";
        
            backButton.before(ingredientsContainer);
        }
    
        if (!fromExcludeMenu) this.fillIngredientsContainer();
        this.changeFormHandler();

        document.getElementById("back-button").onclick = () => this.showTypesMenu(true);
        document.body.addEventListener("click", toggleAllFromCategory);
        window.scrollTo(0, 0);
        changeMainHeight();
    }

    /**
     * Cleans up the screen.
     * @param {boolean} fromFollowing - whether method was called after user clicked back button (not under menu of ingredients exclusion)
     * @param {boolean} fromExcludeMenu - whether method was called after user clicked back button under menu of ingredients exclusion
     */

    cleanUpForIngredientsMenu(fromFollowing, fromExcludeMenu) {
        if (fromFollowing) {
            let dishesContainer = document.querySelector(".dishes-container");
            if (dishesContainer) { 
                dishesContainer.remove();
            } else {
                document.getElementById("back-button").remove();
            }

            let runtimeForm = document.createElement("form");
            runtimeForm.id = "runtime-form";

             main.append(runtimeForm);

            let continueButton = document.createElement("input");
            continueButton.type = "submit";
            continueButton.id = "continue";
            continueButton.value = "Продолжить";

            runtimeForm.append(continueButton);

            this.addBackButton(continueButton);
            document.getElementById("back-button").onclick = () => this.showTypesMenu(true);
            runtimeForm.append(continueButton);
        } else if (!fromExcludeMenu) {
            removeDishTypesMenu();
        }  else {
            showHiddenCheckboxes();
            let searchField = document.querySelector(".search-field");
            searchField.value = "";
            searchField.dispatchEvent(new Event("input"));
        }
    }

    /**
     * Fills the certain container with headers of ingredients' categories, checkboxes and labels of ingredients.
     * @param {HTMLDivElement} ingredientsContainer - container that is filled when this function is called
     */

    fillIngredientsContainer () {
        let ingredientsCategories = PRESETS.ingredientsCategories;

        for (let ingredientCategoryNumber = 0; ingredientCategoryNumber < ingredientsCategories.length; ingredientCategoryNumber++) {
            let ingredientsOfCategory = this.appropriateIngredients[ingredientCategoryNumber];

            createIngredientsCategoryTitle(ingredientsCategories, ingredientCategoryNumber, this.appropriateIngredients);

            if (ingredientsOfCategory.length == 0) {
                addNoIngredientsTitle();
            } else {
                addIngredientsOfCategory(ingredientsOfCategory);
            }
        }
    }

    /**
     * Changes event handler that is ran when _submit_ event happens.
     */

    changeFormHandler() {
        let noAppropriateIngredients = this.appropriateIngredients.reduce((total, item) => item.length == 0 && total, true);

        if (noAppropriateIngredients) {
            document.getElementById("runtime-form").onsubmit = event => this.finalize(event);
        } else {
            document.getElementById("runtime-form").onsubmit = event => {
                event.preventDefault();
                this.analyseIngredients();
                this.showExcludeIngredientsPopUp();
            };
        }
    }

    /**
     * Adds link that leads to page where info about some ingredients is displayed to document.
     */

    addLinkToIngredientsInfo() {
        let linkToIngredientInfo = document.createElement("a");
        linkToIngredientInfo.id = "ingredients-info";
        linkToIngredientInfo.href = "./ingredients_info.html"

        main.append(linkToIngredientInfo);
        window.onscroll = this.changeLinkPosition;

        linkToIngredientInfo.onclick = linkToIngredientInfo.oncontextmenu = () => this.setLocalStorage.call(this);
    }

    /**
     * Finds ingredients that have additional information about them. Returns object with 2 keys: _ingredientsNames_ and _descriptions_. For both properties, values are arrays.
     * @returns {object}
     */

    getIngredientsWithInfo() {
        let appropriateIngredients = this.appropriateIngredients;
        let appropriateIngredientsWithInfo = [];
        let ingredientsDescriptions = [];

        for (let ingredient of INGREDIENTS_INFO) {
            let ingredientCategory = INGREDIENTS.find(item => item[0] == ingredient[0])[3];
            let indexOfCategory = PRESETS.ingredientsCategories.indexOf(ingredientCategory);

            if (appropriateIngredients[indexOfCategory].includes(ingredient[0])) {
                appropriateIngredientsWithInfo.push(ingredient[0]);
                ingredientsDescriptions.push(ingredient[1].replace(/,/g, "?"));
            }
        }

        return {
            ingredientsNames: appropriateIngredientsWithInfo,
            descriptions: ingredientsDescriptions
        };
    }

    /**
     * Adds arrays with names of ingredients with info and their description to localStorage.
     */

    setLocalStorage() {
        let ingredientsWithInfo = this.getIngredientsWithInfo();
        let ingredientsNames = ingredientsWithInfo.ingredientsNames;
        let descriptions = ingredientsWithInfo.descriptions;

        localStorage.setItem("ingredientsNames", ingredientsNames.join(","));
        localStorage.setItem("descriptions", descriptions.join(","));
    }

    /**
     * Makes a list of chosen dishes types and shows menu of ingredients.
     * @param {(PointerEvent|MouseEvent)} event - object of event (event should be either click, pointerup or pointerdown)
     * @see analyseDishesTypes
     * @see showIngredientsMenu
    */

    makeThirdStep(event) {
        event.preventDefault(); 
        this.analyseDishesTypes.call(this);
        this.showIngredientsMenu.call(this);
    }

    /**
     * Adds labels (that correspond to names of ingredients) of checked checkboxes in array, then assigns this array to class field.
     * @param {string} key - key of property of class App to which array will be assigned
     */

    analyseIngredients(key="chosenIngredients") {
        let runtimeForm = document.getElementById("runtime-form");

        let IngredientsCheckboxes = runtimeForm.querySelectorAll("[id^=ingredient-checkbox]");
        let chosenIngredients = [];

        for (let ingredientCheckbox of IngredientsCheckboxes) {
            if (ingredientCheckbox.checked) {
                let ingredient = ingredientCheckbox.nextElementSibling.nextElementSibling.innerHTML;
                chosenIngredients.push(ingredient);
            }
        }

        this[key] = chosenIngredients;
    }

    /**
     * Shows pop-up that asks user whether they would exclude any ingredients.
     */

    showExcludeIngredientsPopUp() {
        let frameForIngredientsExclusion = document.createElement("div");
        frameForIngredientsExclusion.className = "frame-for-pop-up";
        main.append(frameForIngredientsExclusion);

        let excludeIngredientsPopUp = document.createElement("div");
        excludeIngredientsPopUp.className = "exclude-ingredients-pop-up";
        excludeIngredientsPopUp.innerHTML = `<button class="close-button"></button>
        <h2 class="exclude-ingredients-title">Хотите ли вы исключить какие-либо ингредиенты?</h2>
        <div class="exclude-ingredients-panel">
        <button id="exclude-ingredients">Да</button>
        <button id="no-exclude-ingredients">Нет</button>
        </div>`;

        main.append(excludeIngredientsPopUp);

        main.querySelector(".close-button").onclick = this.closeExcludeIngredientsPopUp;
        document.getElementById("exclude-ingredients").onclick = () => {
            this.closeExcludeIngredientsPopUp();
            this.showExcludeIngredientsMenu();
        };
        document.getElementById("no-exclude-ingredients").onclick = event => {
            this.closeExcludeIngredientsPopUp();
            this.finalize(event);
        }
    }

    /**
     * Closes pop-up that was opened by _showExcludeIngredientsPopUp_ method.
     * @see showExcludeIngredientsPopUp
     */

    closeExcludeIngredientsPopUp() {
        main.querySelector(".frame-for-pop-up").remove();
        main.querySelector(".exclude-ingredients-pop-up").remove();
    }

    /**
     * Shows menu of ingredients that user can exclude.
     */

    showExcludeIngredientsMenu() {
        document.getElementById("back-button").onclick = () => this.showIngredientsMenu(false, true);
        document.getElementById("runtime-title").innerHTML = "Какие ингредиенты вы хотите исключить?";

        let runtimeForm = document.getElementById("runtime-form");
        let searchField = runtimeForm.querySelector(".search-field");
        searchField.value = "";
        searchField.dispatchEvent(new Event("input"));

        runtimeForm.onsubmit = event => {
            event.preventDefault();
            this.analyseIngredients("excludedIngredients");
            this.showAppropriateDishes();
        }

        let checkboxes = runtimeForm.querySelectorAll("[id^=ingredient-checkbox]");
        for (let checkbox of checkboxes) {
            if(checkbox.checked) {
                checkbox.checked = false;
                checkbox.hidden = true;
                checkbox.nextElementSibling.classList.add("hidden");
                checkbox.nextElementSibling.nextElementSibling.hidden = true;
            };
        }

        window.scrollTo(0, 0);
    }

    /**
     * Finds dishes that meet user's choice of cuisines, dish types, possible and excluded ingredients.
     * @returns {string[]} array with names of appropriate dishes
    */

    getAppropriateDishes() {
        let appropriateDishes = [];
        let dishesWithExcludedIngredients = [];

        for (let ingredient of this.excludedIngredients){
            let usageOfIngredient = INGREDIENTS.find(item => item[0] == ingredient)[1].split("; ");
            for (let dish of usageOfIngredient) {
                if (!dishesWithExcludedIngredients.includes(dish.toLowerCase())) {
                    dishesWithExcludedIngredients.push(dish.toLowerCase());
                }
            }
        }

        for (let ingredientName of this.chosenIngredients) {
            let ingredientInfo = INGREDIENTS.find( item => item[0] == ingredientName);
            let usageOfIngredient = ingredientInfo[1].split("; ");

            for (let dish of usageOfIngredient) {
                let dishInfo = DISHES.find(item => item[0].toLowerCase() == dish.toLowerCase());

                let dishType = dishInfo[3];
                let cuisine = dishInfo[4];

                if (this.chosenDishTypes.includes(dishType) && this.chosenCuisines.includes(cuisine) && 
                !appropriateDishes.includes(capitalize(dish)) && !dishesWithExcludedIngredients.includes(dish.toLowerCase())) {
                    appropriateDishes.push(capitalize(dish));
                }
            }
        }

        return appropriateDishes;
    }

    /**
     * Shows dishes that meet user's choice of cuisines, dish types, possible and excluded ingredients.
     */

    showAppropriateDishes() {
        window.onscroll = "";
        window.removeEventListener("resize", this.changeLinkPosition);

        let ingredientsInfo = document.getElementById("ingredients-info");
        if (ingredientsInfo) ingredientsInfo.remove();

        let continueButton = document.getElementById("continue");
        continueButton.remove();

        let runtimeForm = document.getElementById("runtime-form");
        runtimeForm.remove();

        let appropriateDishes = this.getAppropriateDishes(this.chosenCuisines, this.chosenDishTypes, this.chosenIngredients);

        let runtimeTitle = document.getElementById("runtime-title");

        if (appropriateDishes.length == 0) {
            runtimeTitle.innerHTML = "Извините, для Вас не нашлось подходящих блюд"
        } else {
            main.style.textAlign = "left";

            runtimeTitle.innerHTML = "Вам подходят следующие блюда:"
            runtimeTitle.marginLeft = 0;

            this.createDishesContainer(appropriateDishes);
        }

        window.scrollTo(0, 0);
        this.addBackButton();
        this.addBackToMainMenuButton();
        changeMainHeight();
    }

    /**
     * Creates container where appropriate dishes are placed.
     * @param {string[]} appropriateDishes - array of appropriate dishes
     */

    createDishesContainer(appropriateDishes) {
        let dishContainer = document.createElement("div");
        dishContainer.className = "dishes-container";
        main.append(dishContainer);

        for (let dish of appropriateDishes) {
            let dishNameSpan = document.createElement("span");
            dishNameSpan.className = "dish-item";
            dishNameSpan.innerHTML = dish;
            dishContainer.append(dishNameSpan);

            let recipeButton = document.createElement("button");
            recipeButton.innerHTML = "Рецепт";
            recipeButton.className = "recipe-button";
            dishContainer.append(recipeButton);
        }

        document.body.addEventListener("click",  this.showRecipeIfFound);
    }

    /**
     * Makes a list of chosen ingredients and shows appropriate dishes.
     * @param {(MouseEvent|PointerEvent)} event - event object (event should be either click, pointerup or pointerdown)
     * @see analyseIngredients
     * @see showAppropriateDishes
     */

    finalize(event) {
        event.preventDefault(); 
        this.analyseIngredients();
        this.showAppropriateDishes();
    }

    /**
     * Extracts name of dish near button "Show recipe" if user has clicked the latter.
     * @param {HTMLElement} target - element click to which has triggered the event 
     * @returns {(string|undefined)} name of the dish or undefined (if user didn't click button "Show recipe")
     */

    getDishForRecipe(target) {
        if (target.className == "recipe-button") {
            let dishName = target.previousSibling.innerHTML;

            return dishName;
        }
    }

    /**
     * Shows recipe of dish which name is calculated by  _getDishForRecipe_ method. If the latter didn't return anything, this method makes nothing.
     * @param {(PointerEvent|MouseEvent)} event - event object (event should be either click, pointerup or pointerdown)
     */

    showRecipeIfFound(event) {
        let dishName = this.getDishForRecipe(event.target);
        if (dishName) showRecipe(dishName);
    }

    addBackToMainMenuButton() {
        const backToMainMenu = document.createElement("button");
        backToMainMenu.id = "main-menu";
        backToMainMenu.innerHTML = "На главное меню";
        const dishesContainer = main.querySelector(".dishes-container");
        if (dishesContainer) {
            dishesContainer.append(backToMainMenu);
        } else {
            main.insertAdjacentHTML("beforeend", "<br />")
            main.append(backToMainMenu);
        }

        backToMainMenu.addEventListener("click", () => this.goToMainMenu());
    }

    goToMainMenu() {
        main.innerHTML = "";
        main.style.textAlign = "center";
        main.insertAdjacentHTML("beforeend", "<button id=\"start\">Начать подбор</button><br /><button id=\"find-dishes\">Найти блюда</button><div class=\"dishes-finder\" hidden><input type=\"text\" name=\"search-field\" id=\"search-field\" placeholder=\"Введите название блюда\"><div class=\"search-results\"><ul></ul></div><button id=\"close-dishes-finder\">Закрыть</button></div>");
        changeMainHeight();
        this.start();
    }
}

/**
 * Capitalizes passed string like in sentences. If initial string contains quotes, this function also capitalizes text in it.
 * @param {string} word - string that needs to be capitalized
 * @returns {string} capitalized string
 */

function capitalize(word) {
    if (!word.includes('"')) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
    } else {
        let firstIndexOfQuotes = word.indexOf('"');
        return word[0].toUpperCase() + word.slice(1, firstIndexOfQuotes + 1).toLowerCase() + word.slice(firstIndexOfQuotes + 1, firstIndexOfQuotes + 2).toUpperCase() +
        word.slice(firstIndexOfQuotes + 2).toLowerCase();
    }
}
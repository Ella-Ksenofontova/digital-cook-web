import { DISHES } from "./dishes_presets.js";
import { changeMainHeight } from "./nav_and_main_functions.js";
import { showRecipe } from "./recipe.js";

const findDishesButton = document.querySelector("#find-dishes");
findDishesButton.addEventListener("click", () => {
  document.querySelector(".dishes-finder").hidden = false;
});

const closeFinderButton = document.querySelector("#close-dishes-finder");
closeFinderButton.addEventListener("click", () => {
  document.querySelector(".dishes-finder").hidden = true;
  document.querySelector("#search-field").value = "";
  document.querySelector(".search-results ul").innerHTML = "";
  changeMainHeight();
});

const searchField = document.getElementById("search-field");
searchField.addEventListener("input", (event) => {
  const dishes = findDishes(event.target.value);
  showResults(dishes);
  changeMainHeight();
})

function findDishes(query) {
  const dishesNames = DISHES.map(item => item[0]);
  const appropriateNames = [];

  for (let name of dishesNames) {
    if (name.toLowerCase().includes(query.toLowerCase()) && query.length > 0) {
      appropriateNames.push(name);
    }
  }

  return appropriateNames;
}

function showResults(appropriateNames) {
  const ul = document.querySelector(".search-results ul");
  ul.innerHTML = "";
  for (let name of appropriateNames) {
    ul.insertAdjacentHTML("beforeend", `<li>${name}<br/><button>Посмотреть рецепт</button></li>`);
  }
}

const dishesFinder = document.querySelector(".dishes-finder");
dishesFinder.addEventListener("click", (event) => {
  if (event.target.tagName == "BUTTON" && !event.target.id) {
    const dishName = event.target.previousSibling.previousSibling.textContent;
    showRecipe(dishName);
  }
})
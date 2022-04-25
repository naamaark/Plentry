import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import vegetable from "../assets/images/vegetable.jpg"
import fruit from "../assets/images/fruit.jpg"
import nuts from "../assets/images/nuts.jpg"
import legumes from "../assets/images/legumes.jpg"
import meats from "../assets/images/meats.jpg"
import dairy from "../assets/images/dairy.jpg"
import vegan from "../assets/images/vegan.jpg"
import spices from "../assets/images/spices.jpg"
import bread from "../assets/images/bread.jpg"
import baking from "../assets/images/baking.jpg"
import condiments from "../assets/images/condiments.jpg"
import pasta from "../assets/images/pasta.jpg"
import alcohol from "../assets/images/alcohol.jpg"

const KEYSUGGESTED = 'suggestedIngredients'
const RECIPESPAGE = 6;
var currPage = 0;
var currRecipes = [];

const categories = [{ name: 'Vegetables', img: vegetable },
{ name: 'Fruits', img: fruit },
{ name: 'Legumes and Grains', img: legumes },
{ name: 'Nuts and Seeds', img: nuts },
{ name: 'Dairy and Eggs', img: dairy },
{ name: 'Spices and Herbs', img: spices },
{ name: 'Meats, Poultry and Seafood', img: meats },
{ name: 'Vegan', img: vegan },
{ name: 'Pasta', img: pasta },
{ name: 'Baking and Sweets', img: baking },
{ name: 'Condiments and Sauces', img: condiments },
{ name: 'Bread and Doughs', img: bread },
{ name: 'Alchohol and Beverages', img: alcohol }]

function getCategories() {
    return categories;
}

async function getIngredients(filterBy) {
    console.log('filterBy in recipe service', filterBy);
    let ingredients = await httpService.post(`recipe/ingredient`, filterBy)
    return ingredients;
}

async function queryRecipes(filterBy) {
    console.log('quering recipes', filterBy);
    let recipes = await httpService.post('recipe', filterBy)
    currRecipes = recipes;
    currPage = 0;
    return recipes;
}

function changePage(diff) {
    let start = currPage + (RECIPESPAGE * diff)
    start = start < 0 ? 0 : start
    let end = start + RECIPESPAGE
    end = (end > currRecipes.length) ? currRecipes.length : end
    currPage = start
    return currRecipes.slice(start, end)
}

function getMissingIngredients(currIngredients, recipes) {
    console.log('curr ingredients', currIngredients);
    return recipes.map(recipe => {
        return recipe.ingredients.filter(
            ingredient => currIngredients.indexOf(ingredient) === -1
        )
    })
}

async function addStorageIngredient(ingredient, key) {
    if (typeof (ingredient) === 'object') {
        ingredient = ingredient.name
    }
    let ingredients = await storageService.query(key);
    if (!ingredients.find(ing => ing === ingredient)) {
        console.log("adding ingredient");
        storageService.post(key, ingredient)
    }
}

async function removeStorageIngredient(ingredient, key) {
    let ingredients = await storageService.query(key);
    if (!ingredients) {
        ingredients = [];
    }
    else if (ingredients.includes(ingredient)) {
        ingredients = ingredients.filter(ing => ing !== ingredient)
    }
    storageService.save(key, ingredients)
}

async function getStorageIngredients(key) {
    let ingredients = await storageService.query(key);
    if (!ingredients) {
        ingredients = [];
    }
    storageService.save(key, ingredients)
    return ingredients;
}

async function updateStorageIngredients(key, ingredients) {
    storageService.save(key, ingredients)
}

async function loadIngredients(filterBy) {
    if (filterBy.type === 'db') return await getIngredients(filterBy)
    else return await getStorageIngredients(filterBy.key)
}


export const recipeService = {
    getIngredients,
    queryRecipes,
    getCategories,
    getMissingIngredients,
    getStorageIngredients,
    addStorageIngredient,
    removeStorageIngredient,
    loadIngredients,
    updateStorageIngredients,
    changePage
}

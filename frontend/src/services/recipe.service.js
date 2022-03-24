import { storageService } from './async-storage.service'
import { httpService } from './http.service'
const KEYSUGGESTED = 'suggestedIngredients'

const categories = ['vegetable', 'fruit', 'legumes and grains', 'nuts and seeds', 'dairy and eggs', 'spices and herbs', 'meats, poultry and seafood', 'vegan', 'pasta', 'baking', 'condiments and sauces', 'bread and doughs', 'alchohol and beverages']

function getCategories() {
    return categories;
}

async function getIngredients(category) {
    let ingredients = await httpService.get(`recipe/${category}`)
    return ingredients;
}

async function queryRecipes(filterBy) {
    let recipes = await httpService.post('recipe', filterBy)
    return recipes;
}

function getMissingIngredients(currIngredients, recipes) {
    return recipes.map(recipe => {
        return recipe.ingredients.filter(
            ingredient => !currIngredients.includes(ingredient)
        )
    })
}

async function addStorageIngredient(ingredient, key) {
    let ingredients = await storageService.query(key);
    if (!ingredients) {
        ingredients = [ingredient];
    }
    else if (!ingredients.includes(ingredient)) {
        ingredients.push(ingredient)
    }
    storageService.save(key, ingredients)
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
    if (filterBy.type === 'db') return await getIngredients(filterBy.key)
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
    updateStorageIngredients
}

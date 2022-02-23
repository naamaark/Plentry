import { storageService } from './async-storage.service'
// import { googleService } from './google.service'

const KEYSUGGESTED = 'suggestedIngredients'

var Recipes = [
    {
        "ingredients": ["Tomato", "Carrot", "Cucumber"],
        "title": "Salad",
        "address": "",
        "image": ""
    },
    {
        "ingredients": ["Tomato", "Potato", "Eggplant"],
        "title": "Ratatoui",
        "address": "",
        "image": ""
    },
    {
        "ingredients": ["Potato", "Yam"],
        "title": "Baked roots",
        "address": "",
        "image": ""
    },
    {
        "ingredients": ["Tomato", "Carrot", "Potato"],
        "title": "Soup",
        "address": "",
        "image": ""
    },
    {
        "ingredients": ["Apple", "Banana", "Yogurt"],
        "title": "Smoothie",
        "address": "",
        "image": ""
    },
    {
        "ingredients": ["Egg", "Tomato", "Potato"],
        "title": "Ommlette",
        "address": "",
        "image": ""
    },
]

var ingredients =
{
    "Vegtables":
        [
            "Tomato",
            "Carrot",
            "Potato",
            "Yam",
            "Eggplant",
            "Cucumber"
        ],
    "Fruits":
        [
            "Apple",
            "Banana",
            "Orange",
            "Pulm"
        ],
    "Dairy":
        [
            "Egg",
            "Milk",
            "Cheese",
            "Yogurt"
        ]
}

function getCategories() {
    return Object.keys(ingredients);
}

function getIngredients(category) {
    return ingredients[category];
}

function loadRecipes({ ingredients, title }) {
    let relevantRecipes = [];
    if (title === '') {
        relevantRecipes = Recipes.filter(recipe => {
            return recipe.ingredients.some(ingredient => ingredients.includes(ingredient))
        })
    }
    else {
        const titleExp = new RegExp(title, 'i');
        relevantRecipes = Recipes.filter(recipe => recipe.title.search(titleExp) !== -1)
    }
    return relevantRecipes;
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
    if (filterBy.type === 'db') return getIngredients(filterBy.key)
    else return await getStorageIngredients(filterBy.key)
}


export const recipeService = {
    getIngredients,
    loadRecipes,
    getCategories,
    getMissingIngredients,
    getStorageIngredients,
    addStorageIngredient,
    removeStorageIngredient,
    loadIngredients,
    updateStorageIngredients
}

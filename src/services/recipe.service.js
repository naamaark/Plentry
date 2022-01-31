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

var suggestedIngredients = new Set();



function getCategories() {
    return Object.keys(ingredients);
}

function getIngredients(category) {
    return ingredients[category];
}

function getRecipes(ingredients = [], title = '') {
    suggestedIngredients.clear();
    let relevantRecipes = [];
    if (title === '') {
        relevantRecipes = Recipes.filter(recipe => {
            return recipe.ingredients.some(ingredient => ingredients.includes(ingredient))
        })
    }
    else {
        const titleExp = new RegExp(title, 'i');
        relevantRecipes = Recipes.filter(recipe => recipe.title.search(titleExp) != -1)
    }
    return relevantRecipes;
}

function getMissingIngredients(currIngredients, recipe) {
    let missingIngredients = recipe.ingredients.filter(ingredient => {
        if (!(currIngredients.includes(ingredient))) {
            suggestedIngredients.add(ingredient);
            return true
        }
        else return false
    })
    return missingIngredients
}

function getSuggestedIngredients() {
    return [...suggestedIngredients];
}

export {
    getIngredients,
    getRecipes,
    getCategories,
    getMissingIngredients,
    getSuggestedIngredients
}

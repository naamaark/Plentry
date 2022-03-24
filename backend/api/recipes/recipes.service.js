const dbService = require('../../services/db.service')
const scraperService = require('../../services/scraper.service')
const searchRecipeService = require('../../services/search.recipe.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getIngredients
}

async function getIngredients(category) {
    try {
        const collection = await dbService.getCollection('Ingredients')
        const ingredients = await collection.find({ category: category }).toArray()
        return ingredients
    } catch (err) {
        logger.error(`while finding ingredients of ${category}`, err)
        throw err
    }
}

async function query(filterBy = { isIngredients: false, isOnline: false, title: "", ingredients: [] }) {
    let { isIngredients, isOnline, title, ingredients } = filterBy
    ingredients = ingredients.map(ingredient => {
        return ingredient.name
    })
    const criteria = _buildCriteria(title)
    const pipeline = _buildRecipePipeline(ingredients)
    try {
        const collection = await dbService.getCollection('Recipes')
        var recipes = []
        if (isIngredients && isOnline) {
            recipes = await getRecipesOnline(ingredients)
        }
        else if (isIngredients) {
            recipes = await collection.aggregate(pipeline).toArray()
        }
        else {
            recipes = await collection.find(criteria).toArray()
        }
        return recipes
    } catch (err) {
        console.log('error', err);
        // logger.error('cannot find recipes', err)
        throw err
    }
}

async function getRecipesOnline(ingredients) {
    const { recipeUrls, regex } = await searchRecipeService.googleSearchRecipes(ingredients)
    let recipes = await recipeUrls.map(async (url) => {
        let rawRecipe = await scraperService.scrapeRecipe(url, regex)
        if (!rawRecipe.ingredients) {
            return null
        }
        let ingredients = await matchIngredietns(rawRecipe.ingredients)

        ingredients = ingredients.filter(ingredient => ingredient)
        ingredients = new Set(ingredients)
        ingredients = Array.from(ingredients)
        rawRecipe.ingredients = [...ingredients]
        return rawRecipe
    })
    recipes = await Promise.all(recipes)
    recipes = recipes.filter(recipe => recipe)
    _updateRecipes(recipes)
    return recipes
}

async function matchIngredietns(ingredientsFromParse) {
    try {
        const collection = await dbService.getCollection('Ingredients')
        let num = await collection.countDocuments()
        let ingredients = await ingredientsFromParse.map(async (ingredient) => {
            if (!ingredient) {
                return null
            }
            const pipeline = await _buildIngredientPipeline(ingredient)
            let matchedIngredient = await collection.aggregate(pipeline)
            matchedIngredient = await matchedIngredient.toArray()
            if (matchedIngredient.length === 0) {
                return null
            }
            matchedIngredient = matchedIngredient.shift()
            return matchedIngredient.name
        })

        ingredients = await Promise.all(ingredients);
        return ingredients
    } catch (error) {
        throw error
    }
}

async function _updateRecipes(recipes) {
    const collection = await dbService.getCollection('Recipes')
    await recipes.forEach(async (recipe) => {
        try {
            await collection.updateOne({ title: recipe.title }, { $set: recipe }, { upsert: true })

        } catch (error) {
            console.log('could not update recipes', error);
        }
    })
}

function _buildCriteria(title) {
    const criteria = {}
    if (title) {
        const txtCriteria = { $regex: title, $options: 'i' }
        criteria.$or = [
            {
                title: txtCriteria
            }
        ]
    }
    return criteria
}

function _buildRecipePipeline(ingredients) {
    try {
        return [
            {
                '$match': {
                    'ingredients': {
                        '$in': ingredients
                    }
                }
            }, {
                '$set': {
                    'missingIngredients': {
                        '$setDifference': [
                            '$ingredients',
                            [...ingredients]
                        ]
                    }
                }
            }, {
                '$set': {
                    'missing_num': {
                        '$size': '$missingIngredients'
                    }
                }
            }, {
                '$sort': {
                    'missing_num': 1
                }
            }, {
                '$limit': 10
            }
        ]
    } catch (error) {
        throw error
    }
}

async function _buildIngredientPipeline(ingredientFromParse) {

    try {
        return [
            {
                '$search': {
                    'text': {
                        'path': 'name',
                        'query': ingredientFromParse,
                        'fuzzy': {}
                    }
                }
            },
            {
                '$project': {
                    'name': 1,
                    score: { $meta: "searchScore" }
                }
            }
        ]
    } catch (error) {
        throw error
    }
}


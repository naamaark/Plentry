const dbService = require('../../services/db.service')
const scraperService = require('../../services/scraper.service')
const searchRecipeService = require('../../services/search.recipe.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getIngredients
}

async function getIngredients(filterBy) {
    let ingredients = []
    try {
        const collection = await dbService.getCollection('Ingredients')
        if (filterBy.by === 'name') {
            console.log('searching ingredient by name');
            const criteria = _buildCriteria(filterBy.key)
            ingredients = await collection.find(criteria).toArray()
        }
        else {
            ingredients = await collection.find({ category: filterBy.key }).toArray()
        }
        ingredients = ingredients.map(ingredient => {
            return ingredient.name
        })
        return ingredients
    } catch (err) {
        logger.error(`while finding ingredients of ${category}`, err)
        throw err
    }
}

async function query(filterBy = { isIngredients: false, isOnline: false, title: "", ingredients: [] }) {
    let { isIngredients, isOnline, title, ingredients } = filterBy
    const criteria = _buildCriteria(title)
    const pipeline = _buildRecipePipeline(ingredients)
    try {
        const collection = await dbService.getCollection('Recipes')
        var recipes = []
        // if (isIngredients && isOnline) {
        //     console.log('client ask to search recipes online');
        //     recipes = await getRecipesOnline(ingredients)
        // }
        if (isIngredients) {
            console.log('client ask to search recipes on db', pipeline);
            recipes = await collection.aggregate(pipeline).toArray()
        }
        else {
            recipes = await collection.find(criteria).toArray()
        }
        if (recipes.length < 10) {
            console.log('recipes length', recipes.length);
            recipes = await getRecipesOnline(ingredients, title)
        }
        return recipes
    } catch (err) {
        console.log('error', err);
        // logger.error('cannot find recipes', err)
        throw err
    }
}

async function getRecipesOnline(ingredients, title) {
    console.log('getting recipes online')
    const { recipeUrls, regex } = await searchRecipeService.googleSearchRecipes(ingredients, title)
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
    await _updateRecipes(recipes)
    return recipes
}

async function matchIngredietns(ingredientsFromParse) {
    console.log('matching ingredients');
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
    console.log('saving recipes to db');
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
            ,
            {
                name: txtCriteria
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
                '$match': {
                    'missing_num': {
                        '$lt': 10
                    }
                }
            }, {
                '$sort': {
                    'missing_num': 1
                }
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


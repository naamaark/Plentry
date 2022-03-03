const dbService = require('../../services/db.service')
const scraperService = require('../../services/scraper.service')
const aggregatorService = require('../../services/aggregator.service')
const searchRecipeService = require('../../services/search.recipe.service')
const ObjectId = require('mongodb').ObjectId

getRecipesOnline(['tomato', 'carrot', 'onion', 'banana']).then(res => {
    console.log('recipes!:', res);
    process.exit()
})


module.exports = {
    query,
    getRecipesOnline
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('recipes')
        var recipes = await collection.find(criteria).toArray()
        recipes = recipes.map(recipe => {
            recipe.createdAt = ObjectId(recipe._id).getTimestamp()
            return recipe
        })
        return recipes
    } catch (err) {
        console.log('error', err);
        logger.error('cannot find recipes', err)
        throw err
    }
}

async function getRecipesOnline(ingredients) {
    const { recipeUrls, regex } = await searchRecipeService.googleSearchRecipes(ingredients)
    let recipes = await recipeUrls.map(async (url) => {
        let rawRecipe = await scraperService.scrapeRecipe(url, regex)
        let ingredients = await aggregatorService.matchIngredietns(rawRecipe.ingredients)
        rawRecipe.ingredients = [...ingredients]
        return rawRecipe
    })
    recipes = await Promise.all(recipes)
    // await _updateRecipes(recipes)
    return recipes
}

async function _updateRecipes(recipes) {
    const collection = await dbService.getCollection('Recipes')
    recipes.forEach(recipe => {
        collection.updateOne({ url: recipe.url }, { $set: { title: recipe.title, ingredients: recipe.ingredients, url: recipe.url, imgSrc: recipe.imgSrc } }, { upsert: true })
    })
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                title: txtCriteria
            }
        ]
    }
    return criteria
}


const dbService = require('./db.service')

module.exports = {
    matchIngredietns
}

const fakeIngredients = ['tomatoes', 'canola oil', 'ginger', 'garlic cloves', 'onion', 'pods', 'whole cloves', 'masala', 'chili powder chili powder', 'coriander', 'cumin', 'salt', 'water', 'syrup', 'cream', 'peas', 'paneer cubes', 'fenugreek', 'cilantro']

async function matchIngredietns(ingredientsFromParse) {
    console.log('aggregator service');
    try {
        const collection = await dbService.getCollection('Ingredients')
        let ingredients = await ingredientsFromParse.map(async (ingredient) => {
            const matchedIngredient = await matchIngredient(ingredient, collection)
            const returnedIngredient = matchedIngredient ? matchedIngredient.name : null
            return returnedIngredient
        })
        console.log('resolving promises');
        ingredients = await Promise.all(ingredients);
        return ingredients
    } catch (error) {
        throw error
    }
}

async function matchIngredient(ingredientFromParse, collection) {
    try {
        const pipeline = await _getPipeline(ingredientFromParse)
        let ingredient = await collection.aggregate(pipeline)
        ingredient = await ingredient.toArray()
        return ingredient.shift()
    } catch (error) {
        throw error
    }
}

async function _getPipeline(ingredientFromParse) {

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

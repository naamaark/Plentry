const dbService = require('./db.service')

module.exports = {
    matchIngredietns
}

async function matchIngredietns(ingredientsFromParse) {
    try {
        const collection = await dbService.getCollection('Ingredients')
        let num = await collection.countDocuments()
        let ingredients = await ingredientsFromParse.map(async (ingredient) => {
            if (!ingredient) {
                return null
            }
            const pipeline = await _getPipeline(ingredient)
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

// async function matchIngredient(ingredientFromParse, collection) {
//     try {

//     } catch (error) {
//         throw error
//     }
// }

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

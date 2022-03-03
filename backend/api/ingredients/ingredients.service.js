const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query
}

async function query(filterBy = {}) {
    console.log('query');
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('ingredients')
        var ingredients = await collection.find(criteria).toArray()
        ingredients = ingredients.map(ingredient => {
            ingredient.createdAt = ObjectId(ingredient._id).getTimestamp()
            return ingredient
        })
        return ingredients
    } catch (err) {
        console.log('error', err);
        logger.error('cannot find ingredients', err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                category: txtCriteria
            }
        ]
    }
    return criteria
}
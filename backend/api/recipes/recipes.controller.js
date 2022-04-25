const recipesService = require('./recipes.service')

module.exports = {
    queryRecipes,
    getIngredients
}
async function queryRecipes(req, res) {
    try {
        const filterBy = req.body
        const recipes = await recipesService.query(filterBy)
        res.send(recipes)
    } catch (err) {
        // logger.error('Failed to query recipes', err)
        console.log('error', err);
        res.status(500).send({ err: 'Failed to query recipes' })
    }
}

async function getIngredients(req, res) {
    try {
        const filterBy = req.body
        console.log('filterby', filterBy);
        const ingredients = await recipesService.getIngredients(filterBy)
        res.send(ingredients)
    } catch (err) {
        logger.error('Failed to get ingredients', err)
        res.status(500).send({ err: 'Failed to get ingredients' })
    }
}

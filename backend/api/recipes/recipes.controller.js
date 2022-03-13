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
        logger.error('Failed to query recipes', err)
        res.status(500).send({ err: 'Failed to query recipes' })
    }
}

async function getIngredients(req, res) {
    try {
        if (!req.params.category) return
        const ingredients = await recipesService.getIngredients(req.params.category)
        res.send(ingredients)
    } catch (err) {
        logger.error('Failed to get ingredients', err)
        res.status(500).send({ err: 'Failed to get ingredients' })
    }
}

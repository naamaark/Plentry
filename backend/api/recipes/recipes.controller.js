const recipesService = require('./recipes.service')

async function getRecipes(req, res) {
    try {
        const filterBy = {
            txt: req.query?.title || ''

        }
        const stations = await recipesService.query(filterBy)
        res.send(stations)
    } catch (err) {
        logger.error('Failed to get stations', err)
        res.status(500).send({ err: 'Failed to get stations' })
    }
}
const express = require('express')
const { queryRecipes } = require('./recipes.controller')
const router = express.Router()

router.post('/', queryRecipes)
router.get('/ingredients', queryIngredients)

module.exports = router
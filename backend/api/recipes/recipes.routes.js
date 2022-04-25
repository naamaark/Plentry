const express = require('express')
const { queryRecipes, getIngredients } = require('./recipes.controller')
const router = express.Router()

router.post('/', queryRecipes)
router.post('/ingredient', getIngredients)

module.exports = router
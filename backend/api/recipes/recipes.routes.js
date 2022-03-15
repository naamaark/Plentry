const express = require('express')
const { queryRecipes, getIngredients } = require('./recipes.controller')
const router = express.Router()

router.post('/', queryRecipes)
router.get('/:category', getIngredients)

module.exports = router
const axios = require('axios')
const { randomNoRepeats } = require('./util.service')
const { scrapeRecipe } = require('./scraper.service')
const API_KEY = 'AIzaSyDMqm9cce9NvsK6LXE4REyKY1QgcAECDlE'
const ENGINE_ID = '38fbee3023e87abab'
const regex1 = /(?<!, | to )/
const regex2 = /\b([a-zA-Z]+(?<!ed|less|cups|cup|tablespoon|tablespoons|garnish|or|ounce|ounces|and|with))\b/
const regex3 = /(?= cloves| fillets| sauce| juice| root| powder| zest| thighs| chips| extract| cheese| flour| oil| breasts| breast| paste| slices| leaves| leaf|seeds| pepper| flakes| bulb| in| milk| seasoning| white| masala| stick|,|,| \(|$)/
let regex4 = '(?= , )'


async function googleSearchRecipes(ingredients) {
    const { searchQuery, selectedIngredients } = _createSearchQuery(ingredients)
    const regex = _createRegex(selectedIngredients)
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${ENGINE_ID}&q=${searchQuery}`
    try {
        const { data } = await axios.get(url)
        const shortData = data.items.slice(0, 20);
        const recipeUrls = await _getRecipesUrls(shortData);
        return { recipeUrls, regex };

    } catch (error) {
        throw error
    }
}

async function _getRecipesUrls(items) {
    return items.map(item => item.link)
}

function _createSearchQuery(ingredients) {
    let searchQuery = 'recipe with '
    const getSelectedIngredients = randomNoRepeats(ingredients)
    const selectedIngredients = [];
    for (let index = 0; index < 4; index++) {
        selectedIngredients.push(getSelectedIngredients())
    }
    const last = selectedIngredients.pop()
    selectedIngredients.forEach((ingredient) => {
        searchQuery = searchQuery + ingredient + ' or '
    })
    searchQuery = searchQuery + last
    selectedIngredients.push(last)
    return { searchQuery, selectedIngredients };
}

function _createRegex(ingredients) {
    let pattern = '';
    const last = ingredients.pop()
    ingredients.forEach(ingredinet => {
        pattern = pattern + ` ${ingredinet}|`
    })
    pattern = pattern + ` ${last}`
    regex4 = regex4.replace(',', pattern);
    return new RegExp(regex1.source + regex2.source + regex3.source + '|' + regex4, 'gm');
}

module.exports = {
    googleSearchRecipes
}


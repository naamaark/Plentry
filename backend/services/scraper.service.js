const puppeteer = require('puppeteer')

async function scrapeRecipe(url, regex) {
    try {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const [el1] = await page.$x('//*[@id="ingredient-list_1-0"]')
        const [el2] = await page.$x('//*[@id="structured-ingredients_1-0"]')
        const el = el1 ? el1 : el2;
        if (!el) return
        const txt = await el.getProperty('outerText')
        const rawTxt = await txt.jsonValue();
        const lines = rawTxt.split(/\r?\n/);
        let ingredients = await lines.map(async (line) => {
            let ingredient = await ingredientsParse(line, regex);
            return ingredient;
        })
        ingredients = await Promise.all(ingredients);
        ingredients = ingredients.filter(ingredient => ingredient)
        ingredients = new Set(ingredients)
        ingredients = Array.from(ingredients)
        browser.close();
    } catch (error) {
        console.log('there was an error:', error);
    }
}

async function ingredientsParse(line, regex) {
    if (line.match(/^\D/)) return null
    let ingredients = line.match(regex)
    ingredients = ingredients ? ingredients.join(' ') : ingredients
    return ingredients;
}

module.exports = {
    scrapeRecipe
}
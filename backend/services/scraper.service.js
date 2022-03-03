const puppeteer = require('puppeteer')

async function scrapeRecipe(url, regex) {
    try {
        console.log('scraping recipe');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const [elTitle] = await page.$x('//*[@id="heading_1-0"]/h1')
        const [elIngredients1] = await page.$x('//*[@id="ingredient-list_1-0"]')
        const [elIngredients2] = await page.$x('//*[@id="structured-ingredients_1-0"]')
        const [elImg] = await page.$x('//*[@id="figure_2-0"]/div/div/img')
        const ingredients = await _getIngredients(elIngredients1, elIngredients2, regex)
        const title = await _getElement(elTitle)
        const imgSrc = await _getElement(elImg, 'imgF')
        browser.close();
        return {
            "url": url,
            "title": title,
            "ingredients": ingredients,
            "imgSrc": imgSrc
        }
    } catch (error) {
        console.log('there was an error:', error);
    }
}

async function _getIngredients(el1, el2, regex) {
    let el = el1 ? el1 : el2;
    if (!el) return
    const rawTxt = await _getElement(el)
    const lines = rawTxt.split(/\r?\n/);
    let ingredients = await lines.map(async (line) => {
        let ingredient = await _ingredientsParse(line, regex);
        return ingredient;
    })
    ingredients = await Promise.all(ingredients);
    ingredients = ingredients.filter(ingredient => ingredient)
    ingredients = new Set(ingredients)
    ingredients = Array.from(ingredients)
    return ingredients
}

async function _getElement(el, type = 'txt') {
    if (!el) return null
    if (type === 'txt') {
        const txt = await el.getProperty('innerText')
        const rawTxt = await txt.jsonValue();
        return rawTxt
    }
    let imgSrc = await el.getProperty('src')
    imgSrc = imgSrc._remoteObject.value
    return imgSrc
}

async function _ingredientsParse(line, regex) {
    if (line.match(/^\D/)) return null
    let ingredients = line.match(regex)
    ingredients = ingredients ? ingredients.join(' ') : ingredients
    return ingredients;
}

module.exports = {
    scrapeRecipe
}
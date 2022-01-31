import React, { useState, useEffect } from 'react';
import { getIngredients, getRecipes, getCategories, getSuggestedIngredients } from '../services/recipe.service';
import ChooseIngredients from '../cmps/choose-ingredient';
import RecipeList from '../cmps/recipe-list';
import FreeSearch from '../cmps/free-search';
import ChooseCategory from '../cmps/choose-category';


function Homepage() {

    const categories = getCategories();
    const [currIngredients, updateCurrIngredients] = useState([]);
    const [recipes, updateRecipes] = useState([]);
    const [ingredients, updateIngredients] = useState([]);
    const [suggestedIngredients, updateSuggestedIngredients] = useState([]);

    useEffect(() => {
        console.log('current ingredients:', currIngredients);
        updateRecipes(getRecipes(currIngredients))
    }, [currIngredients])

    useEffect(() => {
        updateSuggestedIngredients(getSuggestedIngredients());
    }, [recipes])

    const searchRecipesByTitle = (title) => {
        updateRecipes(getRecipes([], title))
    }

    const chooseCategory = (category) => {
        updateIngredients(getIngredients(category))
    }

    const searchRecipesByIngredients = (ingredient) => {
        if (currIngredients.includes(ingredient))
            updateCurrIngredients(currIngredients.filter(currIngredients => currIngredients !== ingredient));
        else
            updateCurrIngredients(currIngredients => [...currIngredients, ingredient]);
    }

    return (
        <div>
            <FreeSearch searchRecipesByTitle={searchRecipesByTitle} />
            <ChooseCategory categories={categories} chooseCategory={chooseCategory} />
            <ChooseIngredients ingredients={ingredients} searchRecipesByIngredients={searchRecipesByIngredients} />
            <h2>You got {recipes.length} recipe options!</h2>
            <h3>Do you have?</h3>
            <ChooseIngredients ingredients={suggestedIngredients} searchRecipesByIngredients={searchRecipesByIngredients}/>
            <RecipeList recipes={recipes} currIngredients={currIngredients} />
        </div>
    );
}

export default Homepage;
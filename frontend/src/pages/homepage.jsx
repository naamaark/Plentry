import React, { useState, useEffect } from 'react';
import { recipeService } from '../services/recipe.service';
import ChooseIngredients from '../cmps/choose-ingredient';
import RecipeList from '../cmps/recipe-list';
import FreeSearch from '../cmps/free-search';
import ChooseCategory from '../cmps/choose-category';
import { useSelector, useDispatch } from 'react-redux';
import { loadRecipes } from '../actions/recipeActions';
import { loadIngredients, onAddIngredient, onRemoveIngredient, setSuggestedIngredients } from '../actions/ingredientActions';

function Homepage() {

    const KEYCURR = { storage: 'currIngredients', store: 'CURR' }
    const KEYINGREDIENTS = { store: 'INGREDIENTS' }

    const dispatch = useDispatch();

    const categories = recipeService.getCategories();
    const ingredients = useSelector(state => state.ingredients);
    const currIngredients = useSelector(state => state.currIngredients);
    const suggestedIngredients = useSelector(state => state.suggestedIngredients);
    const recipes = useSelector(state => state.recipes);
    // const webRecipes = useSelector(state => state.webRecipes)
    // const [isWeb, setIsWeb]=useState(false)


    useEffect(() => {
        loadIngredients({ type: 'storage', key: KEYCURR.storage }, KEYCURR.store, dispatch)
    }, [])

    useEffect(() => {
        loadRecipes({ isIngredients: true, isOnline: false, ingredients: currIngredients, title: '' }, dispatch)
    }, [currIngredients])

    useEffect(() => {
        setSuggestedIngredients(recipes, currIngredients, dispatch);
    }, [recipes])

    const searchRecipesByTitle = (title) => {
        loadRecipes({ ingredients: [], title }, dispatch)
    }

    const chooseCategory = (category) => {
        loadIngredients({ type: 'db', key: category }, KEYINGREDIENTS.store, dispatch)
    }

    const updateCurrIngredients = (ingredient) => {
        if (currIngredients.includes(ingredient))
            onRemoveIngredient(ingredient, KEYCURR.storage, KEYCURR.store, dispatch);
        else
            onAddIngredient(ingredient, KEYCURR.storage, KEYCURR.store, dispatch);
    }

    const getSuggestedIngredients = () => {
        console.log('getting suggested ingredients');
        let ingredients = new Set(suggestedIngredients.flat());
        return [...ingredients]
    }

    return (
        <div>
            <FreeSearch searchRecipesByTitle={searchRecipesByTitle} />
            <ChooseCategory categories={categories} chooseCategory={chooseCategory} />
            <ChooseIngredients ingredients={ingredients} searchRecipesByIngredients={updateCurrIngredients} />
            <h2>You got {recipes.length} recipe options!</h2>
            <h3>Do you have?</h3>
            <ChooseIngredients ingredients={getSuggestedIngredients()} searchRecipesByIngredients={updateCurrIngredients} />
            <RecipeList recipes={recipes} currIngredients={currIngredients} />
        </div>
    );
}

export default Homepage;
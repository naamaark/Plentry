import React, { useState, useEffect } from 'react';
import { recipeService } from '../services/recipe.service';
import { utilService } from '../services/util.service';
import ChooseIngredients from '../cmps/choose-ingredient';
import SearchIngredients from '../cmps/search-ingredients';
import RecipeDetails from '../cmps/recipe-details';
import RecipeList from '../cmps/recipe-list';
import Header from '../cmps/Header';
import { useSelector, useDispatch } from 'react-redux';
import { loadRecipes } from '../actions/recipeActions';
import { loadIngredients, onAddIngredient, onRemoveIngredient, setSuggestedIngredients } from '../actions/ingredientActions';

function Homepage() {

    const KEYCURR = { storage: 'currIngredients', store: 'CURR' }
    const KEYRECIPES = { store: 'RECIPES' }
    const KEYONLINE = { store: 'ONLINE' }

    const dispatch = useDispatch();

    const [currRecipeId, setCurrRecipeId] = useState('');
    const [isRecipe, setIsRecipe] = useState(false);
    const [currPageRecipes, setCurrPageRecipes] = useState([])

    const currIngredients = useSelector(state => state.currIngredients);
    const suggestedIngredients = useSelector(state => state.suggestedIngredients);
    const recipes = useSelector(state => state.recipes);
    const debounceLoadRecipes = utilService.debounce(loadRecipes, 1000)
    // const [isWeb, setIsWeb]=useState(false)


    useEffect(() => {
        loadIngredients({ type: 'storage', key: KEYCURR.storage }, KEYCURR.store, dispatch)
    }, [])

    useEffect(() => {
        if(currIngredients.length>0){
            debounceLoadRecipes({ isIngredients: true, isOnline: false, ingredients: currIngredients, title: '' }, KEYRECIPES.store, dispatch)
        }
    }, [currIngredients])

    useEffect(() => {
        setSuggestedIngredients(recipes, currIngredients, dispatch)
        setCurrPageRecipes(recipeService.changePage(0))
    }, [recipes])

    const searchRecipesByTitle = (title) => {
        console.log('searching recipes by title', title);
        loadRecipes({ isIngredients: false, isOnLine: false, ingredients: [], title: title },KEYRECIPES.store, dispatch)
    }

    const updateCurrIngredients = (ingredient) => {
        if (currIngredients.includes(ingredient))
            onRemoveIngredient(ingredient, KEYCURR.storage, KEYCURR.store, dispatch);
        else
            onAddIngredient(ingredient, KEYCURR.storage, KEYCURR.store, dispatch);
    }

    const getSuggestedIngredients = () => {
        let ingredients = new Set(suggestedIngredients.flat());
        ingredients = [...ingredients]
        ingredients = ingredients.splice(0, 10)
        return [...ingredients]
    }

    const chooseRecipe = (id) => {
        setCurrRecipeId(id)
        setIsRecipe(true)
    }

    const closeRecipeDetails = () => {
        setIsRecipe(false)
    }

    const onChangePage = (diff) => {
        setCurrPageRecipes(recipeService.changePage(diff))
    }

    return (
        <div className='homepage'>
            <Header searchRecipesByTitle={searchRecipesByTitle} />
            <main className='flex main-layout'>
                <div className="recipe-search">
                    <h2 className='recipe-options-title'>You got {recipes.length} recipe options!</h2>
                    <h3 className='suggestions-title'>Do you have?</h3>
                    <div className="page-change flex">
                        <h2 className='paging fas fa-angle-left' onClick={() => { onChangePage(-1) }}></h2>
                        <h2 className='paging fas fa-angle-right' onClick={() => { onChangePage(1) }}></h2>
                    </div>
                    <ChooseIngredients style="suggested-ingredients" ingredients={getSuggestedIngredients()} searchRecipesByIngredients={updateCurrIngredients} />
                    <RecipeList recipes={currPageRecipes} currIngredients={currIngredients} chooseRecipe={chooseRecipe} />
                </div>
                <div className="side-content">
                    {!isRecipe && <SearchIngredients />}
                    {isRecipe && <RecipeDetails id={currRecipeId} closeRecipeDetails={closeRecipeDetails} />}
                </div>
            </main>
        </div>
    );
}

export default Homepage;
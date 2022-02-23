import { storageService } from "../services/async-storage.service";
import { recipeService } from "../services/recipe.service";

export async function loadIngredients(filterBy, name, dispatch) {
    try {
        let ingredients;
        ingredients = await recipeService.loadIngredients(filterBy)
        dispatch({
            type: `SET_INGREDIENTS_${name}`,
            payload: ingredients
        })
    } catch (err) {
        throw err
    }
}

export async function onRemoveIngredient(ingredient, key, name, dispatch) {
    try {
        await recipeService.removeStorageIngredient(ingredient, key);
        dispatch({
            type: `REMOVE_INGREDIENT_${name}`,
            payload: ingredient
        })
    } catch (error) {
        throw error
    }
}

export async function onAddIngredient(ingredient, key, name, dispatch) {
    try {
        await recipeService.addStorageIngredient(ingredient, key);
        dispatch({
            type: `ADD_INGREDIENT_${name}`,
            payload: ingredient
        })
    } catch (error) {
        throw error
    }
}

export async function setSuggestedIngredients(recipes, ingredients, dispatch) {
    let suggestedIngredients = [];
    try {
        suggestedIngredients = recipeService.getMissingIngredients(ingredients, recipes)
        recipeService.updateStorageIngredients('suggestedIngredients', suggestedIngredients)
        dispatch({
            type: 'SET_INGREDIENTS_SUGGESTED',
            payload: suggestedIngredients
        })
    } catch (error) {
        throw error
    }
}


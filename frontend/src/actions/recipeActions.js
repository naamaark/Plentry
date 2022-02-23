import { recipeService } from "../services/recipe.service";

export async function loadRecipes(filterBy, dispatch) {
    try {
        let recipes;
        recipes = await recipeService.loadRecipes(filterBy)
        dispatch({
            type: 'SET_RECIPES',
            payload: recipes
        })
    } catch (err) {
        throw err
    }

}
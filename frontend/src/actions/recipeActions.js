import { recipeService } from "../services/recipe.service";

export async function loadRecipes(filterBy, name, dispatch) {
    try {
        let recipes;
        recipes = await recipeService.queryRecipes(filterBy)
        dispatch({
            type: `SET_RECIPES_${name}`,
            payload: recipes
        })
    } catch (err) {
        throw err
    }

}
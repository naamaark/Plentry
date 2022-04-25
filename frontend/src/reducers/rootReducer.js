import { combineReducers } from 'redux';
import createIngredientsWithNamedType from './ingredientReducer';
import createRecipesWithNamedType from './recipeReducer';

const rootReducer = combineReducers({
    ingredients: createIngredientsWithNamedType('INGREDIENTS'),
    suggestedIngredients: createIngredientsWithNamedType('SUGGESTED'),
    currIngredients: createIngredientsWithNamedType('CURR'),
    recipes: createRecipesWithNamedType('RECIPES'),
    onlineRecipes: createRecipesWithNamedType('ONLINE')
})

export default rootReducer
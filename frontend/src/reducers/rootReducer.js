import { combineReducers } from 'redux';
import createIngredientsWithNamedType from './ingredientReducer';
import recipeReducer from './recipeReducer';

const rootReducer = combineReducers({
    ingredients: createIngredientsWithNamedType('INGREDIENTS'),
    suggestedIngredients: createIngredientsWithNamedType('SUGGESTED'),
    currIngredients: createIngredientsWithNamedType('CURR'),
    recipes: recipeReducer
})

export default rootReducer
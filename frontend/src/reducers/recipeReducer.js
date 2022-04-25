export default createRecipesWithNamedType;

function createRecipesWithNamedType(name = '') {
    return function recipeReducer(state = [], action){
        switch (action.type) {
            case `SET_RECIPES_${name}`:
                return [...action.payload]
            default:
                return state
        }
    }
}

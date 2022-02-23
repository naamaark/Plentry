
export default createIngredientsWithNamedType;

function createIngredientsWithNamedType(name = '') {
    return function ingredients(state = [], action) {
        switch (action.type) {
            case `SET_INGREDIENTS_${name}`:
                return [...action.payload]
            case `ADD_INGREDIENT_${name}`:
                return [
                    ...state,
                    action.payload
                ]
            case `REMOVE_INGREDIENT_${name}`:
                return state.filter(ingredient => ingredient !== action.payload)

            default:
                return state
        }
    }
}
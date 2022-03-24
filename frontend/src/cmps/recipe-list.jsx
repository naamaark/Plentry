import { recipeService } from '../services/recipe.service'
import { useSelector } from 'react-redux'

function RecipeList({ recipes, currIngredients }) {
    const suggestedIngredients = useSelector(state => state.suggestedIngredients);
    function getMissing(idx) {
        if (!suggestedIngredients[idx] || suggestedIngredients[idx].length === 0) {
            return ''
        }
        else {
            let missing = suggestedIngredients[idx].length
            return missing + " missing ingredients"
        }
    }
    return (
        <div>
            {recipes && recipes.length > 0 ?
                recipes.map((recipe, idx) => {
                    return <div>
                        <p>{recipe.title}</p>
                        <p>{getMissing(idx)}</p>
                    </div>
                })
                :
                <p>no recipes</p>
            }
        </div>

    );
}

export default RecipeList;
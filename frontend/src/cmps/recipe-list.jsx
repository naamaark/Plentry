import { recipeService } from '../services/recipe.service'
import { useSelector } from 'react-redux'

function RecipeList({ recipes, currIngredients }) {
    const suggestedIngredients = useSelector(state => state.suggestedIngredients);
    console.log('suggested ingredients', suggestedIngredients);
    return (
        <div>
            {recipes.length > 0 ?
                recipes.map((recipe, index) => {
                    return <p>{`${recipe.title}  
                    ${suggestedIngredients&&suggestedIngredients.length>0 ? suggestedIngredients[index].length : 0}
                    missing ingredients`}</p>
                })
                :
                <p>no recipes</p>
            }
        </div>

    );
}

export default RecipeList;
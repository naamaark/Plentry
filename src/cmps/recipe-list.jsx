import { getMissingIngredients } from '../services/recipe.service'

function RecipeList({ recipes, currIngredients }) {
    return (
        <div>
            {recipes.length > 0 ?
                recipes.map((recipe) => {
                    return <p>{`${recipe.title}  
                    ${getMissingIngredients(currIngredients, recipe ).length}
                    missing ingredients`}</p>
                })
                :
                <p>no recipes</p>
            }
        </div>

    );
}

export default RecipeList;
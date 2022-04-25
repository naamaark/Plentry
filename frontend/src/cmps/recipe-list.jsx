import { useSelector } from 'react-redux'
import RecipePreview from './recipe-preview';

function RecipeList({ recipes}) {
    const suggestedIngredients = useSelector(state => state.suggestedIngredients);
    function getMissing(idx) {
        if (!suggestedIngredients[idx] || suggestedIngredients[idx].length === 0) {
            return 'You got all the ingredients'
        }
        else {
            let missing = suggestedIngredients[idx].length
            return missing + " missing ingredients"
        }
    }
    return (
        <div className='recipe-list grid-layout'>
            {recipes && recipes.length > 0 ?
                recipes.map((recipe, idx) => {
                    return <RecipePreview recipe={recipe} missing={getMissing(idx)}/>
                })
                :
                <p>Select ingredients to find recipes🍏</p>
            }
        </div>

    );
}

export default RecipeList;
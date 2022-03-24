
function ChooseIngredients({ ingredients, searchRecipesByIngredients }) {
    let textIngredients;
    if (typeof (ingredients[0]) === 'object') {
        textIngredients = ingredients.map(ingredient => {
            return ingredient.name
        })
    }
    else textIngredients = ingredients
    return (
        <div>
            {
                ingredients.map((ingredient, idx) => {
                    if (ingredient) {
                        return <button onClick={() => { searchRecipesByIngredients(ingredient) }}>{textIngredients[idx]}</button>;
                    }
                    else return ''
                })
            }
        </div>
    );
}

export default ChooseIngredients;
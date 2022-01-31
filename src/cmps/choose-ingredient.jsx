
function ChooseIngredients({ingredients, searchRecipesByIngredients}) {
    return (
        <div>
            {
                ingredients.map((ingredient) => {
                    return <button onClick={()=>{searchRecipesByIngredients(ingredient)}}>{ingredient}</button>;
                })
            }
        </div>
    );
}

export default ChooseIngredients;
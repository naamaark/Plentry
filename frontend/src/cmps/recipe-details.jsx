import React from 'react';

function RecipeDetails({id, closeRecipeDetails}) {
    const getRecipe=()=>{
        console.log('getting recipe', id);
        //TODO- get recipe from storage by id? is mongoDB id suitable for this?
    }
    return (
        <div>
            <h1>No Recipe</h1>
        </div>
    );
}

export default RecipeDetails
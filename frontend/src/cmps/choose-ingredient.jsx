import React from 'react';
import IngredientButton from './ingredient-button';

function ChooseIngredients({ style, ingredients, searchRecipesByIngredients }) {
    return (
        <div className={style}>
            {
                ingredients.map((ingredient) => {
                    if (ingredient) {
                        return <IngredientButton ingredient={ingredient} searchRecipesByIngredients={searchRecipesByIngredients} />
                    }
                    else return ''
                })
            }
        </div>
    );
}

export default ChooseIngredients;
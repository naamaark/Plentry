import React from 'react';

function RecipeDetails(title, address, ingredientsNum, image) {
    return (
        <div>
            <img src={image} />
            <h3>{title}</h3>
            <p>{address}</p>
            <p>You have {ingredientsNum} ingredients</p>
        </div>
    );
}

export default RecipeDetails
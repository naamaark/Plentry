import React from 'react';
import { utilService } from '../services/util.service';

function RecipePreview({ recipe, missing }) {
    const shortLink = (url) => {
        return utilService.trimString(url, 12, 42) + "..."
    }
    return (
        <div className='recipe-card flex'>
            <img src={recipe.imgSrc} />
            <div className="recipe-card-content flex column">
                <h4>{recipe.title}</h4>
                <a href={recipe.url} className="fas fa-arrow-up-right-from-square"></a>
                <p className='missing'>{missing}</p>
                <p className='credit'>simplyrecipes.com</p>
            </div>
        </div>
    );
}

export default RecipePreview
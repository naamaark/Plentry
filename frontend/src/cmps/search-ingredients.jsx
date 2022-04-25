import React, { useState } from 'react';
import { recipeService } from '../services/recipe.service';
import ChooseCategory from '../cmps/choose-category';
import ChooseIngredients from './choose-ingredient';
import { useSelector, useDispatch } from 'react-redux';
import { loadIngredients, onAddIngredient, onRemoveIngredient } from '../actions/ingredientActions';

function SearchIngredients() {
    const [isIngredients, setIsIngredients] = useState(false);
    const KEYCURR = { storage: 'currIngredients', store: 'CURR' }
    const KEYINGREDIENTS = { store: 'INGREDIENTS' }

    const dispatch = useDispatch();
    const [input, setInput] = useState('');
    const categories = recipeService.getCategories();
    const ingredients = useSelector(state => state.ingredients);
    const currIngredients = useSelector(state => state.currIngredients);

    const chooseCategory = (category) => {
        console.log('getting ingredients');
        loadIngredients({ type: 'db', key: category, by: 'category' }, KEYINGREDIENTS.store, dispatch)
        setIsIngredients(true)
    }

    const closeChooseIngredients = () => {
        setIsIngredients(false)
    }

    const handleChange = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        loadIngredients({ type: 'db', key: input, by: 'name' }, KEYINGREDIENTS.store, dispatch)
        setIsIngredients(true)
    }

    const updateCurrIngredients = (ingredient) => {
        if (currIngredients.includes(ingredient))
            onRemoveIngredient(ingredient, KEYCURR.storage, KEYCURR.store, dispatch);
        else
            onAddIngredient(ingredient, KEYCURR.storage, KEYCURR.store, dispatch);
    }

    return (
        <div className="search-ingredients flex column align-center">
            <div className="search-header">
            <form className='search-line flex space-between'>
                <input name='title' placeholder='Search Ingredient' value={input} onChange={handleChange} autoComplete="on"/>
                <button onClick={handleSubmit} className="fas fa-search"></button>
            </form>
            <h2 className="choose-title space-letters">Choose Key Ingredients</h2>
            </div>
            {!isIngredients && <ChooseCategory categories={categories} chooseCategory={chooseCategory} />}
            {isIngredients && <div className='choose-ingredients-container'>
                <button className="close-btn fas fa-xmark" onClick={closeChooseIngredients}></button>
                <ChooseIngredients style="searched-ingredients" ingredients={ingredients} searchRecipesByIngredients={updateCurrIngredients} />
            </div>
            }
        </div>
    );
}

export default SearchIngredients;
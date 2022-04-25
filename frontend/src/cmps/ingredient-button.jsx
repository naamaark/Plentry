import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function IngredientButton({ ingredient, searchRecipesByIngredients }) {
    const [isSelected, setSelected] = useState(false)
    const currIngredients = useSelector(state => state.currIngredients);
    useEffect(() => {
        if (currIngredients.indexOf(ingredient) !== -1) {
            setSelected(true)
        }
    }, [])
    const toggleSelected = () => {
        setSelected(!isSelected)
    }
    return (
        <button className={`ingredient-button ${isSelected ? `selected` : ``}`} onClick={(ev) => { searchRecipesByIngredients(ingredient); toggleSelected() }}>{ingredient}</button>
    );
}

export default IngredientButton;
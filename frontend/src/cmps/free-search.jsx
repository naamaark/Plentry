import React, { useState } from 'react';


function FreeSearch({ searchRecipesByTitle }) {
    const [input, setInput] = useState('');
    const handleChange = (e) => {
        setInput(e.target.value);
    }
    const handleSubmit = (e) => {
        searchRecipesByTitle(input)
        e.preventDefault();
    }
    return (
        <form >
            <input name='title' placeholder='What do you want to cook today?' value={input} onChange={handleChange}/>
            <button onClick={handleSubmit}>Go!</button>
        </form>
    );
}

export default FreeSearch;
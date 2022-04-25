import React, { useState } from 'react';


function Header({ searchRecipesByTitle }) {
    const [input, setInput] = useState('');
    const handleChange = (e) => {
        setInput(e.target.value);
    }
    const handleSubmit = (e) => {
        searchRecipesByTitle(input)
        e.preventDefault();
    }
    return (
        <div className="header">
            <div className="header-content main-layout flex align-center">
                <h1 className="logo space-letters">Plentry</h1>
                <form className='search-line flex space-between'>
                    <input name='title' placeholder='What do you want to cook today?' value={input} onChange={handleChange} autoComplete="on"/>
                    <button onClick={handleSubmit} className="fas fa-search"></button>
                </form>
            </div>
        </div>
    );
}

export default Header;
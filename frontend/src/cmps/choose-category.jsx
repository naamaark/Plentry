import { getIngredients } from "../services/recipe.service";

function ChooseCategory({ categories, chooseCategory }) {
    return (
        <div className="choose-category">
            
            <div className="category-list grid-layout">
                {
                    categories.map((category) => {
                        return <div className="category-card flex column align-center">
                            <img src={category.img} onClick={() => { chooseCategory(category.name) }} className="category-image" />
                            <p className="category-name">{category.name}</p>
                        </div>
                    })
                }
            </div>
        </div>
    );
}

export default ChooseCategory;
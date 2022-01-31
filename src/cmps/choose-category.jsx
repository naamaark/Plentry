import { getIngredients } from "../services/recipe.service";

function ChooseCategory({categories, chooseCategory}) {
    return (
        <div>
            {
                categories.map((category) => {
                    return <button onClick={()=>{chooseCategory(category)}}>{category}</button>;
                })
            }
        </div>
    );
}

export default ChooseCategory;
import RecipeCard from "./RecipeCard";
import { useLocation } from "react-router-dom";
import "../styles/Recipes.css";

const RecipeList = () => {
    const { state } = useLocation();
    const { recipes } = state;

    if(recipes.length === 0) {
        return <div className="msg"><h1>No Recipes Found.</h1></div>
    }

    return (
        <div className="RecipeList">
            {recipes.map(recipe => (
                <li key={recipe.id}>
                    <RecipeCard key={recipe.id} id={recipe.id} username={recipe.username} title={recipe.title} recipe_description={recipe.recipe_description} preparation_time={recipe.preparation_time} cooking_time={recipe.cooking_time} servings={recipe.servings} created_at={recipe.created_at}/>
                </li>
            ))}
        </div>
    );
};

export default RecipeList;

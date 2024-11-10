import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Details.css";
import KitchenlyApi from "../../api";
import { useAuthContext } from "../helpers/AuthProvider";
import { useState } from "react";

const Details = () => {
    const navigate = useNavigate();
    const [update, setUpdate] = useState(false);
    const { user } = useAuthContext();
    const { state } = useLocation();
    const { recipe } = state;

    const isFavorite = (id) => {
        const favorites = user.favorites;
        for(let r of favorites) {
            if(r.id === id){
                return true;
            }
        }
        return false;
    }

    const saveRecipe = async (id) => {
        const res = await KitchenlyApi.saveRecipe(user.username, id);
        setUpdate(!update);
    }

    const unsaveRecipe = async (id) => {
        const res = await KitchenlyApi.unsaveRecipe(user.username, id);
        setUpdate(!update);
    }

    const formatDate = (time) => {
        const date = new Date(time);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDay();
        const hour = date.getHours();
        const second = date.getSeconds();

        const formatted_date = `${day}/${month}/${year} @ ${hour}:${second}`;

        return formatted_date;
    }

    const gotoTag = async (id) => {
        const recipes = await KitchenlyApi.getRecipesByTags([id]);
        return navigate('/recipes', { state: { recipes: recipes }});
    }

    const gotoCategory = async (id) => {
        const recipes = await KitchenlyApi.getRecipesByCategory([id]);
        return navigate('/recipes', { state: { recipes: recipes }});
    }

    return (
        <div className="RecipeDetailContainer">
            <div id={recipe.id} className="Detail">
                <div className="DetailMeta">
                    <div className="DetailHeader">
                        <h1 id="RecipeDetailTitle">{recipe.title}</h1>
                        <div className="DetailCategories">
                            {recipe.categories.map(c => (
                                <span onClick={async () => await gotoCategory(c.id)} key={c.id}>{c.category_name} </span>
                            ))}
                        </div>
                    </div>
                    <div className="FavoriteContainer">
                        {isFavorite(recipe.id) ? (
                            <div onClick={() => unsaveRecipe(recipe.id)} className="Favorite RecipeIsFavorite">
                                <span id="starTrue">&#9733;</span>
                            </div>
                        ) : 
                        (
                            <div onClick={() => saveRecipe(recipe.id)} className="Favorite RecipeIsNotFavorite">
                                <span id="starFalse">&#9733;</span>
                            </div>
                        )}
                    </div>
                    <p><span className="DetailMetaUser">@{recipe.username}</span> <span className="DetailMetaTime">{formatDate(recipe.created_at)}</span></p>
                    <div className="DetailTags">
                        <p>
                            {recipe.tags.map(t => (
                                <span onClick={async () => await gotoTag(t.id)} key={t.id}>{t.tag_name} </span>
                            ))}
                        </p>
                    </div>
                </div>
                <br></br>
                <hr></hr>
                <div className="DetailInfo">
                    <div className="PreInfoDiv">
                        <h3>Before you start</h3>
                        <div className="PreInfo">
                            <p>Preparation Time: {recipe.preparation_time} minutes</p>
                            <p>Cooking Time: {recipe.cooking_time} minutes</p>
                            <p>Serves {recipe.servings} people</p>
                        </div>
                    </div>
                    <div className="DetailIngredientDiv">
                        <h3>Ingredients</h3>
                        <div className="DetailIngredients">
                            {recipe.ingredients.map(i => (
                                <p key={i.id}>{i.ingredient_name}</p>
                            ))}
                        </div>
                    </div>
                    <div className="DetailDescription">
                        <p>{recipe.recipe_description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;

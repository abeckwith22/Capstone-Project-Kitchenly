import { useNavigate } from "react-router-dom";
import KitchenlyApi from "../../api";
import { useAuthContext } from "../helpers/AuthProvider";
import { useState } from "react";
import "../styles/RecipeBar.css";

const RecipeBar = ({ id, username, title, preparation_time, cooking_time, servings, created_at}) => {
    const navigate = useNavigate();

    const viewRecipe = async (id) => {
        const recipe = await KitchenlyApi.getRecipe(id);
        navigate(`/recipes/${id}`, { state: { recipe: recipe }});
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

    return (
        <div onClick={() => viewRecipe(id)} key={id} id={id} className="RecipeBarContainer">
            <div className="RecipeBarMeta">
                <h1 className="RecipeBarTitle">{title}</h1>
                <p className="RecipeBarCreated"><i>{formatDate(created_at)}</i></p>
                <p className="RecipeBarCreator"><i>{username}</i></p>
            </div>
        </div>
    );
};

export default RecipeBar;

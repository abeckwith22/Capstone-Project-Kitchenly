import { useNavigate } from "react-router-dom";
import KitchenlyApi from "../../api";
import { useAuthContext } from "../helpers/AuthProvider";

const RecipeCard = ({ id, username, title, preparation_time, cooking_time, servings, created_at}) => {
    const navigate = useNavigate();
    const { user } = useAuthContext();

    console.debug(user);

    const viewRecipe = async (id) => {
        const recipe = await KitchenlyApi.getRecipe(id);
        navigate(`${id}`, { state: { recipe: recipe }});
    }

    const isFavorite = (id) => user.favorites.includes(id);

    const saveRecipe = async (id) => {
        const res = await KitchenlyApi.saveRecipe(username, id);
    }

    const unsaveRecipe = async (id) => {
        const res = await KitchenlyApi.unsaveRecipe(username, id);
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
        <div onClick={() => viewRecipe(id)} key={id} id={id} className="RecipeCard">
            <div className="RecipeCardTitleDiv">
                <div className="Favorite">
                    {isFavorite(id) ? (
                        <div className="RecipeIsFavorite">
                            <span id="starTrue">&#9733;</span>
                        </div>
                    ) : 
                    (
                        <div className="RecipeIsNotFavorite">
                            <span id="starFalse">&#9733;</span>
                        </div>
                    )}
                </div>
                <h1 className="RecipeCardTitle">{title}</h1>
                <p className="RecipeCardCreated"><i>{formatDate(created_at)}</i></p>
                <p className="RecipeCardCreator"><i>{username}</i></p>
            </div>
            <hr></hr>
            <br></br>
            <div className="RecipeCardInfo">
                <p className="RecipeCardPrep">Time to prepare: {preparation_time} minutes</p>
                <p className="RecipeCardCook">Time to cook: {cooking_time} minutes</p>
                <p className="RecipeCardFeeds">Serves {servings} people</p>
            </div>
        </div>
    );
};

export default RecipeCard;

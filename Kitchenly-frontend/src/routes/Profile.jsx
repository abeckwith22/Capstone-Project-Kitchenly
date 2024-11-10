import { useContext } from "react";
import { useAuthContext } from "../helpers/AuthProvider";
import "../styles/Profile.css";
import RecipeCard from "./RecipeCard";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, isLoaded } = useAuthContext();
    const navigate = useNavigate();

    if(!isLoaded) return;

    return (
        <>
            <div className="container">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">{user.username} Profile</h1>
                </div>
                <div className="ProfileCard">
                    <h1>Username: {user.username}</h1>
                    <h1>First name: {user.first_name}</h1>
                    <h1>Last name: {user.last_name}</h1>
                    <h1>Email: {user.email}</h1>
                    <button onClick={() => navigate(`/users/${user.username}/edit`)} className="ProfileButton EditButton">Edit User</button>
                    <button onClick={() => navigate(`/users/${user.username}/delete`)} className="ProfileButton DeleteButton">Delete User</button>
                </div>
            </div>

            <div className="container">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">Submitted Recipes</h1>
                </div>
                <div className="ProfileCard">
                    {user.recipes && user.recipes.length > 0 ? 
                    (
                        user.recipes.map(recipe => (
                            <li className="ProfileSubmitted" key={recipe.id}>
                                <RecipeCard key={recipe.id} id={recipe.id} username={recipe.username} title={recipe.title} recipe_description={recipe.recipe_description} preparation_time={recipe.preparation_time} cooking_time={recipe.cooking_time} servings={recipe.servings} created_at={recipe.created_at}/>
                            </li>
                        ))
                    )
                    : (
                        <h1>False</h1>
                    )}
                </div>
            </div>

            <div className="container">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">Saved Recipes</h1>
                </div>
                <div className="ProfileCard">
                    {user.favorites && user.favorites.length > 0 ? 
                    (
                        user.favorites.map(recipe => (
                            <li className="ProfileSubmitted" key={recipe.id}>
                                <RecipeCard key={recipe.id} id={recipe.id} username={recipe.username} title={recipe.title} recipe_description={recipe.recipe_description} preparation_time={recipe.preparation_time} cooking_time={recipe.cooking_time} servings={recipe.servings} created_at={recipe.created_at}/>
                            </li>
                        ))
                    )
                    : (
                        <h1>False</h1>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;

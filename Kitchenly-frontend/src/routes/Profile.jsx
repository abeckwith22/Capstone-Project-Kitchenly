import { useEffect, useState } from "react";
import { useAuthContext } from "../helpers/AuthProvider";
import "../styles/Profile.css";
import RecipeBar from "./RecipeBar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, isLoaded, refreshUser} = useAuthContext();
    const [pageKey, setPageKey] = useState("submitted");
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser(user.token);
    }, []);
    
    if(!isLoaded) return <div className="LoadingScreen"><h1>Loading!</h1></div>;

    const loadFavorites = () => {
        return (
            <div className="RecipeBarList">
                {user.favorites && user.favorites.length > 0 ? 
                (
                    user.favorites.map(recipe => (
                        <li className="InfoLi" key={recipe.id}>
                            <RecipeBar key={recipe.id} id={recipe.id} username={recipe.username} title={recipe.title} recipe_description={recipe.recipe_description} preparation_time={recipe.preparation_time} cooking_time={recipe.cooking_time} servings={recipe.servings} created_at={recipe.created_at}/>
                        </li>
                    ))
                )
                : (
                    <h2 className="emptyList">You have not saved any recipes.</h2>
                )}
            </div>
        );
    };

    const loadSubmitted = () => {
        return (
            <div className="RecipeBarList">
                {user.recipes && user.recipes.length > 0 ? 
                (
                    user.recipes.map(recipe => (
                        <li className="InfoLi" key={recipe.id}>
                            <RecipeBar key={recipe.id} id={recipe.id} username={recipe.username} title={recipe.title} recipe_description={recipe.recipe_description} preparation_time={recipe.preparation_time} cooking_time={recipe.cooking_time} servings={recipe.servings} created_at={recipe.created_at}/>
                        </li>
                    ))
                )
                : (
                    <h2 className="emptyList">You have not submitted any recipes.</h2>
                )}
            </div>
        );
    };

    const pages = {
        "submitted": loadSubmitted(),
        "favorites": loadFavorites(),
    };


    return (
        <>
            <div className="ProfileContainer">
                <div className="ProfileTitleBar">
                    <div className="ProfileInfo">
                        <h1 className="ProfileUsername">@{user.username}</h1>
                        <h3>{user.first_name}</h3>
                        <h3>{user.last_name}</h3>
                        <h3>{user.email}</h3>
                    </div>
                    <div className="ProfileOptionsContainer">
                        <button className="ProfileButton EditButton" onClick={() => navigate(`/users/${user.username}/edit`)}>Edit User</button>
                        <button className="ProfileButton DeleteButton" onClick={() => navigate(`/users/${user.username}/delete`)}>Delete Account</button>
                    </div>
                </div>

                <div className="ProfileDataContainer">
                    <div className="ProfileDataContainerNav">
                        <p onClick={() => setPageKey("submitted")} className={`NavSlip ${pageKey === "submitted" ? "selected" : ""}`}>Submitted Recipes</p>
                        <p onClick={() => setPageKey("favorites")} className={`NavSlip ${pageKey === "favorites" ? "selected" : ""}`}>Saved Recipes</p>
                    </div>
                    <div className="ProfileDataInfoContainer">
                        {
                            pages[pageKey]
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;

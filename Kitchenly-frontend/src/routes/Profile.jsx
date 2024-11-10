import { useContext } from "react";
import { useAuthContext } from "../helpers/AuthProvider";
import "../styles/Profile.css";
import RecipeCard from "./RecipeCard";

const Profile = () => {
    const { user, isLoaded } = useAuthContext();

    if(!isLoaded) return;

    console.debug(user);

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
                    <button className="ProfileButton EditButton">Edit User</button>
                    <button className="ProfileButton DeleteButton">Delete User</button>
                </div>
            </div>

            <div className="container">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">Submitted Recipes</h1>
                </div>
                <div className="ProfileCard">
                    {user.recipes && user.recipes.length > 0 ? <h1>True</h1> : <h1>False</h1>}
                </div>
            </div>

            <div className="container">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">Saved Recipes</h1>
                </div>
                <div className="ProfileCard">
                    {user.favorites && user.favorites.length > 0 ? <h1>True</h1> : <h1>False</h1>}
                </div>
            </div>
        </>
    );
};

export default Profile;

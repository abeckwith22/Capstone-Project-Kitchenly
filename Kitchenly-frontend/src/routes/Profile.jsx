import { useContext } from "react";
import { useAuthContext } from "../helpers/AuthProvider";
import "../styles/Profile.css";

const Profile = () => {
    const { user, isLoaded } = useAuthContext();

    if(!isLoaded) return;

    return (
        <>
            <div className="container">
                <div className="ProfileCard">
                    <h1>Username: {user.username}</h1>
                    <h1>First name: {user.first_name}</h1>
                    <h1>Last name: {user.last_name}</h1>
                    <h1>Email: {user.email}</h1>
                    { user.recipes.length > 0 ?
                        <h1>Recipes: {user.recipes}</h1>
                    : null
                    }
                </div>
                { user.recipes.length > 0 ?
                    <div className="ProfileRecipes">
                        {/* rendered recipe cards will go here */}
                    </div>
                : null
                }
            </div>
        </>
    );
};

export default Profile;

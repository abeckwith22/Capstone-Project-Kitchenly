import KitchenlyApi from "../../api"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../helpers/AuthProvider";

const useForm = (INITIAL_STATE={}) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const navigate = useNavigate();
    const { user, login, setLoggedIn } = useAuthContext();
    
    const handleChange = e => {
        let { name, value } = e.target;
        const intTerms = ['preparation_time', 'cooking_time', 'servings'];

        // sets value to integer if terms are included.
        if(intTerms.includes(name)) value = +value;

        setFormData(formData => ({
            ...formData,
            [name]:value,
        }));
    }
    
    const handleSignUp = async e => {
        e.preventDefault();
        const token = await KitchenlyApi.registerUser(formData);
        const authorized = await login(token);
        if(authorized) {
            setLoggedIn(true);
        } 
        navigate("/");
    }

    const handleLogin = async e => {
        e.preventDefault();
        const token = await KitchenlyApi.getToken(formData);
        const authorized = await login(token);
        if(authorized) {
            setLoggedIn(true);
        }
        navigate("/");
    }

    const handleSearch = async e => {
        e.preventDefault();
        const recipes = await KitchenlyApi.getRecipes(formData); 
        setFormData(INITIAL_STATE);
        navigate("/recipes", { state: { recipes: recipes }});
    }

    const handleCreateRecipe = async e => {
        e.preventDefault();
        const newRecipe = await KitchenlyApi.createRecipe(user.username, formData);
        console.debug(newRecipe);
        // setFormData(INITIAL_STATE);
    }

    const handleEditRecipe = async e => {
        e.preventDefault();
        console.debug(formData);
        // const updatedRecipe = await KitchenlyApi.updateRecipe()
    }

    const handleDeleteRecipe = async e => {
        e.preventDefault();
        console.debug("username:", user.username);
        console.debug("recipe_id:", formData.recipe_id);
        const result = await KitchenlyApi.deleteRecipe(user.username, formData.recipe_id);
        console.debug(result);
        navigate("/");
    }

    const handleEditProfile = async e => {
        e.preventDefault();
        const data = {};
        Object.keys(formData).map(key => { // gets rid of undefined values
            if(formData[key]){
                data[key] = formData[key];
            }
        })
        const result = await KitchenlyApi.patchUser(user.username, data);
        setLoggedIn(false);
        const authorized = await login(user.token);
        if(authorized) {
            setLoggedIn(true);
        }
        navigate("/profile");
    }

    const handleDeleteUser = async e => {
        e.preventDefault();
        console.debug(formData);
        const result = await KitchenlyApi.deleteUser(user.username);
        setLoggedIn(false);
        navigate("/login");
    }

    return { handleChange, 
             handleSignUp, 
             handleLogin, 
             handleSearch, 
             handleCreateRecipe, 
             handleEditRecipe,
             handleDeleteRecipe,
             handleEditProfile,
             handleDeleteUser,
             formData };
}

export default useForm;

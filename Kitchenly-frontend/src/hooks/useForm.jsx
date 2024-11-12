import KitchenlyApi from "../../api"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../helpers/AuthProvider";

const useForm = (INITIAL_STATE={}) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const navigate = useNavigate();
    const { user, login, logout, setLoggedIn, refreshUser } = useAuthContext();
    

    /********** Generic *********/

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

    /********** Recipes *********/

    const handleCreateRecipe = async (e,ingredients=[],tags=[]) => {
        e.preventDefault();
        formData.ingredients = sanitize(ingredients);
        formData.tags = sanitize(tags);
        
        delete formData.ingredient_name;
        delete formData.tag_name;
        
        const newRecipe = await KitchenlyApi.createRecipe(user.username, formData);
        console.debug(newRecipe);
        setFormData(INITIAL_STATE);
        refreshUser(user.token);
    }

    const createRecipeDraft = (ingredients=[], tags=[]) => {

        formData.ingredients = sanitize(ingredients);
        formData.tags = sanitize(tags);

        return formData;
    }

    const sanitize = (arr) => {
        const newArr = arr.filter(i => {
            const str = i.trim();
            if(str !== undefined && str !== "") {
                return str;
            }
        })
        return newArr;
    }

    const handleEditRecipe = async (e, recipe_id=0, ingredients=[], tags=[]) => {
        e.preventDefault();
        console.debug(formData);
        formData.ingredients = sanitize(ingredients);
        formData.tags = sanitize(tags);

        delete formData.ingredient_name;
        delete formData.tag_name;

        const updatedRecipe = await KitchenlyApi.updateRecipe(user.username, recipe_id, formData);
        console.debug(updatedRecipe);
        setFormData(INITIAL_STATE);
        refreshUser(user.token);
    }

    const handleDeleteRecipe = async e => {
        e.preventDefault();
        console.debug("username:", user.username);
        console.debug("recipe_id:", formData.recipe_id);
        const result = await KitchenlyApi.deleteRecipe(user.username, formData.recipe_id);
        console.debug(result);
        refreshUser(user.token);
        navigate("/");
    }

    /********** Users *********/

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
        logout();
        setLoggedIn(false);
        navigate("/login");
    }

    return { 
        handleChange, 
        handleSignUp, 
        handleLogin, 
        handleSearch, 
        handleCreateRecipe, 
        createRecipeDraft,
        handleEditRecipe,
        handleDeleteRecipe,
        handleEditProfile,
        handleDeleteUser,
        formData,
        setFormData,
    };
}

export default useForm;

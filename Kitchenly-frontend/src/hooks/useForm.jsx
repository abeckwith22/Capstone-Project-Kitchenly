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

    return { handleChange, handleSignUp, handleLogin, handleSearch, handleCreateRecipe, formData };
}

export default useForm;

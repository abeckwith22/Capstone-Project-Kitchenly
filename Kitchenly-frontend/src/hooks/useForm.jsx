import KitchenlyApi from "../../api"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../helpers/AuthProvider";

const useForm = (INITIAL_STATE={}) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const navigate = useNavigate();
    const { login, setLoggedIn } = useAuthContext();
    
    const handleChange = e => {
        const { name, value } = e.target;
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

    return { handleChange, handleSignUp, handleLogin, formData };
}

export default useForm;

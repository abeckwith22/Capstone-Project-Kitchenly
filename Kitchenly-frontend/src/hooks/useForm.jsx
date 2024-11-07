import KitchenlyApi from "../../api"; 
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import useAuth from "./useAuth";

const useForm = (INITIAL_STATE={}) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const { login } = useAuth();
    
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(formData => ({
            ...formData,
            [name]:value,
        }));
    }
    
    const handleSignUp = async e => {
        e.preventDefault();
        console.debug(formData);
        const token = await KitchenlyApi.registerUser(formData);
        await login(token);
    }

    const handleLogin = async e => {
        e.preventDefault();
        console.debug(formData);
        const token = await KitchenlyApi.getToken(formData);
        await login(token);
    }

    return { handleChange, handleSignUp, handleLogin, formData };
}

export default useForm;

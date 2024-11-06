import KitchenlyApi from "../../api"; 
import { useState } from "react";
// import { useNavigate } from "react-router-dom";

const useForm = (INITIAL_STATE={}) => {
    const [formData, setFormData] = useState(INITIAL_STATE);

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
        const res = await KitchenlyApi.registerUser(formData);
        console.debug(res);
    }

    const handleLogin = async e => {
        e.preventDefault();
        console.debug(formData);
        const token = await KitchenlyApi.getToken(formData);
        console.debug(token);
    }

    return { handleChange, handleSignUp, handleLogin, formData };
}

export default useForm;

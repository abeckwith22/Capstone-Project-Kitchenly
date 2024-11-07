import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import KitchenlyApi from "../../api";
import { useNavigate } from "react-router-dom";

// useAuth hook will check users authorization with token and won't load the page if failed.

const useAuth = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    // checks local storage for user; if exists, attempts to log in user with token
    const checkLocalStorage = async () => {
        const localToken = localStorage.getItem('token');
        if(localToken) await login(localToken);
    }
    
    // setLoggedIn to true, set user, save token to localStorage
    const login = async (token) => {
        const { username } = jwtDecode(token);
        console.debug(username);
        KitchenlyApi.setToken(token);
        const user = await KitchenlyApi.getUser(username);
        console.debug(user);
        if(!user.status) {
            user.token = token;
            localStorage.setItem("token", token);
            setUser(user);
            setLoggedIn(true);
            navigate("/");
        }
        setIsLoaded(true);
    }
    
    // setLoggedIn to false, delete user, delete token from localStorage
    const logout = () => {
        setLoggedIn(false);
        localStorage.clear();
        KitchenlyApi.setToken("");
    }
    
    useEffect(() => {
        console.debug("RUNNING USEEFFECT--------------------------------------------");
        console.debug("isLoaded:", isLoaded);
        console.debug("loggedIn:", loggedIn);
        setIsLoaded(false);
        checkLocalStorage();
        setIsLoaded(true);
    }, [loggedIn]);

    return { loggedIn, user, isLoaded, login, logout };
}

export default useAuth;

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Remove the braces around jwtDecode if it's a default export
import KitchenlyApi from "../../api";

const useAuth = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    // checks local storage for user; if exists, attempts to log in user with token
    const checkLocalStorage = async () => {
        const localToken = localStorage.getItem('token');
        if (localToken) await login(localToken);
    };

    useEffect(() => {
        const authUser = async () => {
            await checkLocalStorage();
            setIsLoaded(true);
        }
        authUser();
    }, []);

    // setLoggedIn to true, set user, save token to localStorage
    const login = async (token) => {
        try {
            const { username } = jwtDecode(token);
            KitchenlyApi.setToken(token);
            const user = await KitchenlyApi.getUser(username);
            if (!user.status) {
                user.token = token;
                localStorage.setItem("token", token);
                setUser(user);
                return true;
            }
        } catch (error) {
            console.error("Failed to log in:", error);
        }
        return false;
    };

    // setLoggedIn to false, delete user, delete token from localStorage
    const logout = () => {
        setUser({});
        setLoggedIn(false);
        localStorage.removeItem("token");
        KitchenlyApi.setToken("");
    };

    return { user, isLoaded, loggedIn, setLoggedIn, login, logout, checkLocalStorage, };
};

export default useAuth;

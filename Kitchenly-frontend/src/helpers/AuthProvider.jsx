import { createContext } from "react";
import useAuth from "../hooks/useAuth";
import { useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { loggedIn, setLoggedIn, user, isLoaded, login, logout } = useAuth();

    if(!isLoaded) return;

    return (
        <AuthContext.Provider value={{loggedIn, setLoggedIn, user, isLoaded, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);

import { createContext } from "react";
import useAuth from "../hooks/useAuth";
import { useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { loggedIn, user, isLoaded, login, logout } = useAuth();

    return (
        <AuthContext.Provider value={{loggedIn, user, isLoaded, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);

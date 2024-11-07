import { useContext, useEffect } from "react";
import { AuthContext } from "../helpers/AuthProvider";
import { Navigate } from "react-router-dom";
import { useState } from "react";

const Logout = () => {
    const { logout } = useContext(AuthContext);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        logout();
        setIsLoaded(true);
    });

    if(!isLoaded) return null;

    return (
        <Navigate to="/login"/>
    );
}

export default Logout;

import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../helpers/AuthProvider";
import { useContext } from "react";

const ProtectedRoutes = () => {
    const { loggedIn, isLoaded } = useAuthContext(); // - [ ] FIX add authorization.
    
    if(!isLoaded){
        return;
    }

    if(loggedIn) {
        return <Outlet/>
    } else {
        return <Navigate to={'/login'}/>
    }
}

export default ProtectedRoutes;

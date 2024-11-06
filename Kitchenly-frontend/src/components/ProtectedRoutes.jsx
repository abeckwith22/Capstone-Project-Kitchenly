import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const { isAuthenticated, setIsAuthenticated } = useState(true); // - [ ] FIX add authorization.
    isLoaded = true; // placeholder for protected routes
    loggedIn = isAuthenticated;
    
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

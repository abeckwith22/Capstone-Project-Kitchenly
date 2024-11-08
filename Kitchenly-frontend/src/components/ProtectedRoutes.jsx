import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../helpers/AuthProvider";

const ProtectedRoutes = () => {
    const { user } = useAuthContext();

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;

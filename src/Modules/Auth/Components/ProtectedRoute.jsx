import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

function ProtectedRoute({ children }) {

    const { isAuthenticated } = useAuth();

    if(!isAuthenticated){
        alert("Acceso denegado. No cuenta con los permisos, inicie sesión");
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { parseJwt } from "../Services/authServices"; 

function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated } = useAuth();
    const token = localStorage.getItem('authToken');

    // 1. Validación de Autenticación básica
    if(!isAuthenticated || !token){
        alert("Acceso denegado. Inicie sesión."); 
        return <Navigate to="/login" replace />;
    }

    // 2. Validación de Roles (Solo si la ruta tiene un requiredRole)
    if (requiredRole) {
        const decodedToken = parseJwt(token);
        
        const userRole = decodedToken?.role || 
                         decodedToken?.Role || 
                         decodedToken?.roles ||
                         decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; // Común en .NET

        const currentRole = typeof userRole === 'string' ? userRole.toUpperCase() : '';
        
        let hasPermission = false;
        
        if (Array.isArray(userRole)) {
           hasPermission = userRole.some(r => 
               (typeof r === 'string' ? r.toUpperCase() : r.name?.toUpperCase()) === requiredRole.toUpperCase()
           );
        } else {
           hasPermission = currentRole === requiredRole.toUpperCase();
        }

        if (!hasPermission) {
            alert(`Acceso denegado: Se requiere ${requiredRole} pero el usuario es ${currentRole}`);
            return <Navigate to="/login" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;
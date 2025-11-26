import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth no debe ser usado fuera de AuthProvider");
    }
    
    return {
        isAuthenticated: context.isAuthenticated,
        setIsAuthenticated: context.setIsAuthenticated,
        handleLogout: context.logout,
        signin: context.signin,

    };

};

export default useAuth;
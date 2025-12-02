import { createContext, useState } from "react";
import { loginUser } from "../Services/authServices";


const AuthContext = createContext();

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const authToken = localStorage.getItem('authToken');
        return Boolean(authToken);
    })

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        alert("Sesión cerrada correctamente.");
    }

    const signin = async (username, password) => {
        const {data, error} = await loginUser(username, password);
        if(error){
            return {error};
        }
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        //saveUser(data.user);
        // user;
        alert("Sesión iniciada correctamente.");
        return {error: null, user: data.user};
    }

    return (
        <AuthContext.Provider 
            value={{
                isAuthenticated,
                setIsAuthenticated,
                signin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export{
    AuthProvider,
    AuthContext,
};
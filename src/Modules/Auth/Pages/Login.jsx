import { useState } from "react";
import Input from "../../Shared/Components/Input";'./Input.jsx';

function Login(){
    const[Username, setUsername] = useState("");
    const[Password, setPassword] = useState("");

    const[UsernameErrors, setUsernameErrors] = useState("");
    const[PasswordErrors, setPasswordErrors] = useState("");

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if(!value){
            setUsernameErrors("Nombre de usuario requerido");
        }
        else{
            setUsernameErrors("");
        }
    };
    
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if(!value){
            setPasswordErrors("Contraseña requerida");
        } else if(value.length < 8){
            setPasswordErrors("La contraseña debe tener al menos 8 caracteres");
        } else {
            setPasswordErrors("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };  

    return(
            <form onSubmit={handleSubmit}>
                <h2>Inicio de Sesión</h2>
                <Input
                    label="Usuario"
                    type="text"
                    value={Username}
                    onChange={handleUsernameChange}
                    error={UsernameErrors}
                />
                <Input
                    label="Contraseña"
                    type="password"
                    value={Password}
                    onChange={handlePasswordChange}
                    error={PasswordErrors}
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
        );
}
export default Login;
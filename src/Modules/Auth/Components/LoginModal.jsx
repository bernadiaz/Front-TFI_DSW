import { useForm } from "react-hook-form";
import Input from "../../Shared/Components/Input";
import Button from "../../Shared/Components/Button";
import { useState } from "react";
import { X } from "lucide-react";
import { loginUser } from "../Services/authServices";



const LoginModal = ({ onClose, onSwitchToRegister, onSuccess }) =>{
    
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Llama a tu servicio
            const res = await loginUser(formData.username, formData.password);
            
            // Soporte para diferentes estructuras de respuesta
            const token = res.token || (res.data && res.data.token);

            if (!token) throw new Error("No se recibió un token válido.");

            // Guardamos token y notificamos éxito
            localStorage.setItem('authToken', token);
            if (onSuccess) onSuccess(token);
            onClose(); // Cerramos el modal
        } catch (err) {
            console.error(err);
            setError("Credenciales inválidas o error de conexión.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>
                
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nombre de usuario" 
                        type="text" 
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        error={error && " "} 
                    />
                    <Input
                        label="Contraseña" 
                        type="password" 
                        name="password"
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={handleChange}
                        error={error} 
                    />
                    
                    {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded border border-red-100">{error}</p>}

                    <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </Button>
                </form>
                
                <p className="text-center mt-4 text-sm text-gray-500">
                    ¿No tienes cuenta? <button onClick={onSwitchToRegister} className="text-purple-600 font-bold hover:underline">Regístrate aquí</button>
                </p>
            </div>
        </div>
    );
}

export default LoginModal;
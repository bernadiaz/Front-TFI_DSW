import Input from "../../Shared/Components/Input";
import Button from "../../Shared/Components/Button";
import { useState } from "react";
import { X } from "lucide-react";
import { registerUser } from "../Services/authServices";
import { useForm } from "react-hook-form";


const RegisterModal = ({ onClose, onSwitchToLogin, onSuccess }) => {
    // Usamos useForm para manejar validaciones igual que en tu página de Registro
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const [authError, setAuthError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onRegisterSubmit = async (formData) => {
        setIsLoading(true);
        setAuthError(null);

        try {
            // Preparamos el payload incluyendo el ROL FIJO
            const dataToSend = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                role: "CLIENTE" // <--- ROL FORZADO AQUÍ
            };

            const res = await registerUser(dataToSend);
            
            // Verificamos si hubo error en la respuesta del servicio (según tu estructura)
            if (res.error) {
                throw new Error(res.error);
            }

            const token = res.token || (res.data && res.data.token);

            if (!token) {
                // Si el registro es exitoso pero no devuelve token automático
                alert("Registro exitoso. Por favor inicia sesión.");
                onSwitchToLogin();
                return;
            }

            // Si hay token, logueamos directamente
            localStorage.setItem('authToken', token);
            if (onSuccess) onSuccess(token);
            onClose();

        } catch (err) {
            console.error(err);
            setAuthError(err.message || "Error al registrarse. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Cuenta</h2>
                
                <form onSubmit={handleSubmit(onRegisterSubmit)} className="flex flex-col gap-1">
                    
                    {/* Campo: Nombre Completo */}
                    <Input 
                        label="Nombre Completo" 
                        type="text" 
                        placeholder="Juan Pérez" 
                        error={errors.name?.message}
                        {...register("name", { required: "El nombre es requerido" })}
                    />

                    {/* Campo: Usuario */}
                    <Input 
                        label="Usuario" 
                        type="text" 
                        placeholder="juanperez" 
                        error={errors.username?.message}
                        {...register("username", { required: "El usuario es requerido" })}
                    />

                    {/* Campo: Email */}
                    <Input 
                        label="Email" 
                        type="email" 
                        placeholder="tu@email.com" 
                        error={errors.email?.message}
                        {...register("email", { 
                            required: "El email es requerido",
                            pattern: {
                                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                message: "Email inválido"
                            }
                        })}
                    />

                    {/* Campo: Teléfono (NUEVO) */}
                    <Input 
                        label="Teléfono" 
                        type="tel" 
                        placeholder="381..." 
                        error={errors.phoneNumber?.message}
                        {...register("phoneNumber", { 
                            required: "El teléfono es requerido",
                            minLength: { value: 6, message: "Mínimo 6 números" }
                        })}
                    />

                    {/* Campo: Contraseña */}
                    <Input 
                        label="Contraseña" 
                        type="password" 
                        placeholder="••••••••" 
                        error={errors.password?.message}
                        {...register("password", { 
                            required: "La contraseña es requerida",
                            minLength: { value: 8, message: "Mínimo 8 caracteres" }
                        })}
                    />
                    
                    {/* Mensaje de Error General */}
                    {authError && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded border border-red-100 text-center">{authError}</p>}

                    <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </Button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-500">
                    ¿Ya tienes cuenta? <button onClick={onSwitchToLogin} className="text-purple-600 font-bold hover:underline">Inicia Sesión</button>
                </p>
            </div>
        </div>
    );
};

export default RegisterModal;
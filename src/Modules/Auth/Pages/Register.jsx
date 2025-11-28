import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Card from "../../Shared/Components/Card";
import Input from "../../Shared/Components/Input";
import Button from "../../Shared/Components/Button";
import { registerUser } from "../Services/authServices";
import { useState } from "react";

function Register() {
    // 'watch' nos sirve para leer el valor de la contraseña en tiempo real y compararla
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);

        const result = await registerUser({
            username: data.username, 
            email: data.email,
            password: data.password,
            role: data.role 
        });

        setIsSubmitting(false);

        if (result.error) {
            setSubmitError(result.error);
        } else {
            alert("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
            navigate('/login');
        }
    };

    // Observamos el campo password para la validación de confirmación
    const password = watch("password");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300 text-gray-200">  
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 bg-gray-100 p-8 rounded-lg shadow-xl w-full max-w-sm">    
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                    Registro
                </h2>

                {submitError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                        {submitError}
                    </div>
                )}

                <Input
                    label="Usuario"
                    type="text"
                    error={errors.username?.message}
                    {...register("username", { required: "El usuario es requerido" })}
                />

                <Input
                    className="w-full"
                    label="Email"
                    type="email"
                    error={errors.email?.message}
                    {...register("email", { 
                        required: "El email es requerido",
                        pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                            message: "Email inválido"
                        }
                    })}
                />

                <div className="flex flex-col gap-1">
                    <label className="text-gray-900 text-sm font-medium">Role</label>
                    <select
                        className={`bg-gray-100 text-gray-600 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                        {...register("role", { required: "Seleccione un rol" })}
                        defaultValue=""
                    >
                        <option value="" disabled>Seleccione una opción</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="VENDEDOR">Vendedor</option>
                        <option value="CLIENTE">Cliente</option>
                    </select>
                    {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
                </div>

                <Input
                    label="Contraseña"
                    type="password"
                    error={errors.password?.message}
                    {...register("password", { 
                        required: "La contraseña es requerida",
                        minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" }
                    })}
                />

                <Input
                    label="Confirmar contraseña"
                    type="password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword", { 
                        required: "Confirme su contraseña",
                        validate: (value) => value === password || "Las contraseñas no coinciden"
                    })}
                />

                <div className="flex flex-col gap-3 mt-4">
                    <Button 
                        type="submit"
                    >
                        Registrar Usuario
                    </Button>

                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => navigate('/login')}
                    >
                        Inicio de Sesión
                    </Button>
                </div>
            </form>
            
        </div>
    );
}

export default Register;
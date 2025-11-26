import { set, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "../../Shared/Components/Input"; 
import Button from "../../Shared/Components/Button";  
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  const { signin } = useAuth();

  const onValid = async (FormData) => { 
    try{
      const {error} = await signin(FormData.Username, FormData.Password);
      
      if (error){
        setErrorMessage(error);
        return;
      }
      
      navigate("/admin/home");

    } catch (error){
      console.log(error);
      setErrorMessage("Error inesperado. Comuníquese con el administrador.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
    <form 
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col gap-4 bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm"
    >
      
      <h2 className="text-3xl font-bold text-center text-white mb-4">
        Inicio de Sesión
      </h2>

      <Input
        label="Usuario"
        type="text"
        // Pasamos el error si existe
        error={errors.Username?.message}
        // Pasamos todas las props de react-hook-form (name, onBlur, onChange, ref)
        {...register("Username", {
          required: "Nombre de usuario requerido",
        })}
      />

      <Input
        label="Contraseña"
        type="password"
        error={errors.Password?.message}
        {...register("Password", {
          required: "Contraseña requerida",
          minLength: {
            value: 8,
            message: "La contraseña debe tener al menos 8 caracteres",
          },
        })}
      />
      
      <Button type='submit'>Iniciar Sesión</Button>
      <Button onClick={() => navigate('/register')}>Registrarse</Button>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2 text-center">{errorMessage || "Error al conectar con el servidor"}</p>
      )}
    </form>
    </div>
  );
}
export default Login;
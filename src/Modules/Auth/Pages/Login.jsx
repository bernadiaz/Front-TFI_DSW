import { set, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "../../Shared/Components/Input"; 
import Button from "../../Shared/Components/Button";  
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { parseJwt } from "../Services/authServices";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { signin } = useAuth();

  const onValid = async (FormData) => { 
    try {
      const response = await signin(FormData.Username, FormData.Password);
      
      if (response.error) {
        setErrorMessage(response.error);
        return;
      }
      
      // Intentamos obtener el usuario de la respuesta o del token decodificado
      let userRole = null;

      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = parseJwt(token);
        console.log("Token decodificado:", decodedToken); // Mira esto en consola
          
        if (decodedToken) {
          // Busca el rol en las propiedades comunes del token
          userRole = decodedToken.role || 
                     decodedToken.headers?.role || 
                     decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || // Común en .NET
                     decodedToken.roles;
        }
      }
      

      console.log("Rol detectado:", userRole);

      // --- VERIFICACIÓN DE ROL ---
      const isAdmin = (role) => {
        if (!role) return false;
        if (typeof role === 'string') return role.toUpperCase() === 'ADMIN';
        if (Array.isArray(role)) return role.some(r => (typeof r === 'string' ? r.toUpperCase() === 'ADMIN' : r.name === 'ADMIN'));
        return false;
      };

      if (isAdmin(userRole)) {
        navigate("/admin/home");
      } else {
        navigate("/"); 
      }

    } catch (error) {
      console.log(error);
      setErrorMessage("Error inesperado. Comuníquese con el administrador.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 text-gray-200">
    <form 
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col gap-4 bg-gray-100 p-8 rounded-lg shadow-xl w-full max-w-sm"
    >
      
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Inicio de Sesión
      </h2>

      <Input
        label="Usuario"
        type="text"
        error={errors.Username?.message}
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
      <Button onClick={() => navigate('/register')} variant='secondary'>Registrarse</Button>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2 text-center">{errorMessage || "Error al conectar con el servidor"}</p>
      )}
    </form>
    </div>
  );
}
export default Login;
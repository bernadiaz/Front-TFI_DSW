import Input from "../../Shared/Components/Input";
import {useForm} from "react-hook-form"; 
import '../../Shared/Components/Input.css';  

function Login(){
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        console.log("Datos enviados: ", data);
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Inicio de Sesión</h2>
        <div className="input-container">
            <div className="input-field">
              <label>Usuario</label>
              <input
                type="text"
                // "register" se aplica directamente al input
                {...register("Username", {
                  required: "Nombre de usuario requerido",
                })}
              />
            </div>
        </div>
        {errors.Username && <span className="error-message">{errors.Username.message}</span>}
        
        <div className="input-container">
        <div className="input-field">
          <label>Contraseña</label>
          <input
            type="password"
            {...register("Password", {
              required: "Contraseña requerida",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            })}
          />
        </div>
      </div>


        {errors.Password && <span className="error-message">{errors.Password.message}</span>}
        <button type="submit">Iniciar Sesión</button>
        </form>
        );
}
export default Login;

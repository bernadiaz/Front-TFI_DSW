// Ya NO importamos './Input.css'

/**
 * Componente Input reutilizable con estilos de Tailwind.
 * * NOTA: Corregí las props. Ahora aceptamos "...rest"
 * para pasar automáticamente 'name', 'onChange', 'onBlur', etc.,
 * desde react-hook-form directamente al <input>.
 */
function Input({ label, type, error, ...rest }) {
  return (
    /**
     * .input-container
     * display: flex -> flex
     * flex-direction: column -> flex-col
     * * Nota: Tu CSS tenía 'min-width: 400px' en el .input-field.
     * Lo he cambiado a 'w-full' (ancho completo) para que
     * se adapte al contenedor del formulario (que ya tiene un max-w-sm).
     * Si prefieres el ancho fijo, puedes usar 'min-w-[400px]'.
     */
    <div className="w-full flex flex-col">
      
      {/* .input-field */}
      <div className="flex items-center mb-1">
        
        {/* .input-field label */}
        <label 
          htmlFor={rest.name} // Buena práctica para accesibilidad
          className="
            w-[100px]      /* width: 100px */
            mr-2.5         /* margin-right: 10px */
            text-right      /* text-align: left */
            text-sm font-medium text-gray-300" /* Estilos extra para modo oscuro */
        >
          {label}
        </label>
        
        {/* * .input-field input 
         * Usamos los mismos estilos del Login.jsx anterior para consistencia
        */}
        <input
          id={rest.name}
          type={type}
          className="
            flex-1        /* flex-grow: 1 */
            p-2           /* padding: 8px */
            bg-gray-700 border border-gray-600 rounded-md /* Estilos base */
            text-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500" /* Estilos de :focus */
          {...rest}     /* Aquí se pasan name, onBlur, onChange, ref de react-hook-form */
        />
      </div>
      
      {/* .error-message */}
      {error && (
        <span 
          className="
            h-5           /* min-height: 20px (para mantener espacio) */
            text-xs        /* font-size: 0.8em */
            text-red-400   /* color: red */
            pl-[110px]     /* padding-left: 110px (100px label + 10px margin) */
            w-full box-border" /* width: 100% y box-sizing */
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;
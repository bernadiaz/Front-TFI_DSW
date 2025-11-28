// Ya NO importamos './Input.css'

/**
 * Componente Input reutilizable con estilos de Tailwind.
 * * NOTA: Corregí las props. Ahora aceptamos "...rest"
 * para pasar automáticamente 'name', 'onChange', 'onBlur', etc.,
 * desde react-hook-form directamente al <input>.
 */
function Input({ label, type, error, ...rest }) {
  return (
    <div className="w-full flex flex-col">
      
      <div className="flex items-center mb-1">
        <label 
          htmlFor={rest.name} // Buena práctica para accesibilidad
          className="
            w-[100px]      /* width: 100px */
            mr-2.5         /* margin-right: 10px */
            text-right      /* text-align: left */
            text-sm font-medium text-gray-900" 
        >
          {label}
        </label>
        
        <input
          id={rest.name}
          type={type}
          className="
            flex-1        /* flex-grow: 1 */
            p-2           /* padding: 8px */
            bg-gray-200 border border-gray-600 rounded-md /* Estilos base */
            text-gray-900 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            w-full box-border" 
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;
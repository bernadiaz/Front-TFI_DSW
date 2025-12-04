// Ya NO importamos './Input.css'

function Input({ label, type, error, ...rest }) {
  return (
    <div className="w-full flex flex-col mb-4"> 
      <div className="flex flex-col"> 
        <label 
          htmlFor={rest.name}
          className="
            w-full           
            mb-1             
            text-left        
            text-sm font-medium text-gray-900" 
        >
          {label}
        </label>
        
        <input
          id={rest.name}
          type={type}
          className="
            w-full           
            p-2
            bg-gray-200 border border-gray-600 rounded-md
            text-gray-900 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...rest}
        />
      </div>
      
      {/* .error-message */}
      {error && (
        <span 
          className="
            mt-1             /* Un poco de espacio arriba del error */
            text-xs 
            text-red-400 
            
            text-left       
            w-full box-border" 
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;
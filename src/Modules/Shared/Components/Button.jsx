import React from 'react';

function Button({ 
  children, 
  type = 'button', 
  variant = 'default', 
  fullWidth = true, // <--- Nueva prop (true por defecto)
  ...restProps 
}) {
  
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const variantStyle = {
    // 1. QUITAMOS 'w-full' y 'mt-4' de aquí para que sea más flexible
    default: 'bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200',
    secondary: 'bg-gray-100 hover:bg-gray-200 transition py-2 px-4 rounded-md',
  };

  return (
    <button
      {...restProps}
      type={type}
      className={`
        ${variantStyle[variant]} 
        ${fullWidth ? 'w-full' : 'w-auto'}  {/* 2. Controlamos el ancho aquí */}
        ${restProps.className || ''}        {/* 3. Permitimos clases extra */}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
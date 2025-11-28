
function Button({ 
  children, 
  type = 'button', 
  variant = 'default', 
  fullWidth = true, 
  ...restProps 
}) {
  
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const variantStyle = {
    default: 'bg-purple-300 text-gray-600 py-2 px-4 rounded-md font-semibold hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200',
    secondary: 'bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-900 hover:text-white transition py-2 px-4 rounded-md',
  };

  return (
    <button
      {...restProps}
      type={type}
      className={`
        ${variantStyle[variant]} 
        ${fullWidth ? 'w-full' : 'w-auto'}  
        ${restProps.className || ''}       
      `}
    >
      {children}
    </button>
  );
};

export default Button;
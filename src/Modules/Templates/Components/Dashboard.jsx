import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../Auth/Hooks/useAuth';
import Button from '../../Shared/Components/Button';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  const { handleLogout } = useAuth();

  const logout = () => {
    if(window.confirm("¿Cerrar sesión?")) {
        handleLogout(); 
        navigate('/login'); 
    }
  };

  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block  pt-4 pb-4 rounded-4xl transition hover:bg-purple-300
      ${isActive
      ? 'bg-purple-400 hover:bg-purple-400 '
      : ''
    }
    `
  );

  const renderLogoutButton = ({ isMobile }) => (
    <button 
        onClick={logout} 
        className={`
            bg-red-600 hover:bg-red-700 text-white font-bold transition shadow rounded-md
            ${isMobile 
                // - w-full: Ocupa todo el ancho.
                // - sm:hidden: Se OCULTA automáticamente si la pantalla es grande (Escritorio).
                ? 'w-full py-3 mt-auto sm:hidden'       
                
                // - hidden: Está OCULTO por defecto (en móviles).
                // - sm:block: APARECE automáticamente si la pantalla es grande (Escritorio).
                : 'hidden sm:block px-4 py-2 text-sm'   
            }
        `}
    >
        Cerrar sesión
    </button>
  );

  return (
    <div
      className="
        p-4
        h-screen
        grid
        grid-cols-1
        grid-rows-[auto_1fr]
        bg-gray-200
        overflow-hidden

        sm:grid-cols-[256px_1fr]
        sm:gap-x-6
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          p-4
          shadow
          rounded
          bg-gray-100

          sm:col-span-2
        "
      >
        <span>Mi Dashboard</span>
        {renderLogoutButton({ isMobile: false })}
        <button
          className="
            bg-transparent
            border-none
            shadow-none

            sm:hidden
          "
          onClick={() => setOpenMenu(!openMenu)}
        >{ openMenu ? <span>&#215;</span> : <span>&#9776;</span>}</button>
      </header>
      <aside
        className={`
          absolute
          top-5
          bottom-0
          bg-gray-100
          w-64
          p-6
          ${openMenu ? 'left-0' : '-left-64'}
          rounded
          shadow
          flex
          flex-col
          justify-between

          sm:relative
          sm:left-0
        `}
      >
        <nav>
          <ul
            className='flex flex-col'
          >
            <li>
              <NavLink
                to='/admin/home'
                className={getLinkStyles}
              >Principal</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/products'
                className={getLinkStyles}
              >Productos</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/orders'
                className={getLinkStyles}
              >Ordenes</NavLink>
            </li>
          </ul>
          <hr className='opacity-10 mt-4' />
        </nav>
        {renderLogoutButton({isMobile: true})}
      </aside>
      <main
        className="
          p-4
          overflow-y-auto
        "
      >
        <div className="h-full">
          <Outlet />
        </div>
        
      </main>
    </div>
  );
};

export default Dashboard;

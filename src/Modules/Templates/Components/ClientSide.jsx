import React, { useEffect } from "react";
// import { MOCK_PRODUCTS } from "../../Products/Pages/ProductsCatalogue";
import { useNavigate } from "react-router-dom";
import Button from "../../Shared/Components/Button";
import { Search, Menu, X } from 'lucide-react';
import { Outlet } from "react-router-dom";
import { useState } from "react";


function ClientSide() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    const navigate = useNavigate();

    const navigateToLogin = () =>{
      navigate('/login');
    }

    const navigateToRegister = () =>{
      navigate('/register');
    }

    const navigateToCatalogue = () =>{
      navigate('/');
    }

    const navigateToCart = () =>{
      navigate('/cart');
    }


    return (
        <div className="h-screen w-full bg-gray-50 font-sans text-gray-800 flex flex-col overflow-hidden">
            
            {/* --- NAVBAR --- */}
            <nav className="bg-white p-4 shadow-sm z-50 shrink-0">
                <div className="w-full flex justify-between items-center gap-3">
                    
                    {/* Logo */}
                    <div className="flex items-center gap-2 font-bold text-xl shrink-0">
                        <span className="hidden sm:block">MiTienda</span>
                    </div>

                    <div className="hidden md:flex items-center gap-4 shrink-0">
                        <Button fullWidth={false} onClick={navigateToCatalogue}>
                            Productos
                        </Button>
                        <Button fullWidth={false} onClick={navigateToCart}>
                            Carrito de compras 
                        </Button>
                    </div>

                    {/* Buscador */}
                    <div className="flex-1 max-w-sm relative mx-4">
                        <input 
                            type="text" 
                            placeholder="Buscar productos..." 
                            className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-purple-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>

                    {/* Menú Derecha */}
                    <div className="hidden md:flex items-center gap-4 shrink-0">
                        <Button variant='secondary' fullWidth={false} onClick={navigateToLogin}>
                            Iniciar Sesión
                        </Button>
                        <Button variant='secondary' fullWidth={false} onClick={navigateToRegister}>
                            Registrarse
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        className="md:hidden p-2 shrink-0" 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t pt-4 flex flex-col gap-3">
                        <Button className="px-2" onClick={navigateToCatalogue}>Productos</Button>
                        <Button className="px-2" onClick={navigateToCart}>Carrito</Button>
                        <div className="flex gap-2 mt-2">
                            <Button variant='secondary' onClick={navigateToLogin}>Iniciar Sesión</Button>
                            <Button variant='secondary' onClick={navigateToRegister}>Registrarse</Button>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
                <Outlet context={{ searchTerm, setSearchTerm }} />
            </main>
        </div>
    );
}


export default ClientSide;
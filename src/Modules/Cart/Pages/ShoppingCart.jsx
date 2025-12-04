import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"; 
import { Trash2, Minus, Plus, ShoppingBag, X, Mail, User, Lock } from 'lucide-react';

// Componentes y Servicios
import Button from '../../Shared/Components/Button.jsx';
import Input from '../../Shared/Components/Input.jsx';
import { createOrder } from '../../Orders/Services/OrdersServices.js';
import { parseJwt } from '../../Auth/Services/authServices.js';
import { registerUser } from '../../Auth/Services/authServices.js'; // Mantenemos registro directo o podrías usar un hook si existe
import useAuth from '../../Auth/Hooks/useAuth'; // <--- Asegúrate que la ruta sea correcta a tu hook
import SelectionModal from '../../Auth/Components/SelectionModal.jsx';
import LoginModal from '../../Auth/Components/LoginModal.jsx';
import RegisterModal from '../../Auth/Components/RegisterModal.jsx';

export default function CartPage() {
  const navigate = useNavigate();
  const { signin } = useAuth(); // <--- Usamos el hook de autenticación

  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados para Modals
  const [showAuthSelection, setShowAuthSelection] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Estado para error general (del servidor)
  const [serverError, setServerError] = useState(null);

  // 1. Cargar carrito
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // 2. Guardar cambios
  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // --- LÓGICA DE CANTIDADES ---
  const increaseQty = (id) => {
    const newCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  const decreaseQty = (id) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity - 1) };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cartItems.filter(item => item.productId !== id && item.id !== id);
    updateCart(newCart);
  };

  // --- CÁLCULOS ---
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (parseFloat(item.currentUnitPrice) * item.quantity), 0);

  // --- LÓGICA DE PROCESAMIENTO DE ORDEN ---
  const processOrder = async (token) => {
    setIsProcessing(true);
    try {
      const decodedToken = parseJwt(token);
      console.log("🔍 Token Nuevo:", decodedToken); 

      if (!decodedToken) throw new Error("Token inválido");

      // Buscamos el ID en las propiedades estándar donde .NET lo suele poner
      const userId = decodedToken["uid"] || 
                     decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      // Validación crítica
      if (!userId) {
          throw new Error("El token no contiene el ID del usuario (claims: nameidentifier/uid). Revisa el Backend.");
      }

      console.log("✅ ID User encontrado:", userId);

      const orderData = {
        customerId: userId.toString(), // Ahora sí enviará el GUID
        shippingAddress: "Dirección predeterminada", 
        billingAddress: "Dirección predeterminada",
        orderItems: cartItems.map(item => ({
            productId: (item.productId || item.id).toString(),
            quantity: parseInt(item.quantity)
        }))
      };

      // ... (El resto de la función sigue igual: llamada a createOrder, manejo de errores, etc.)
      const response = await createOrder(orderData, token);
      
      if (!response.ok) {
         // ... tu manejo de errores existente ...
         const errorText = await response.text();
         throw new Error("Error del servidor: " + errorText);
      }

      localStorage.removeItem('cart');
      setCartItems([]);
      alert("¡Compra realizada con éxito!");

    } catch (error) {
      console.error(error);
      alert(error.message);
      if (error.message.includes("Backend")) {
          // Si falta el ID, forzamos logout para que genere token nuevo
          localStorage.removeItem('authToken');
          setShowAuthSelection(true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HANDLER INICIAL ---
  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    const token = localStorage.getItem('authToken');
    
    if (token) {
        processOrder(token);
    } else {
        setShowAuthSelection(true);
    }
  };

  // --- MANEJO DE CIERRE DE MODALES ---
  // Esta función se pasa a los modales para que al terminar exitosamente,
  // el carrito continúe con el proceso de compra.
  const handleAuthSuccess = (token) => {
      // Los modales se cierran solos por su propiedad onClose, 
      // aquí solo nos encargamos de la lógica de negocio del carrito.
      processOrder(token);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800 relative">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-2">
        <h1 className="text-2xl font-bold">Carrito de compras</h1>
        <span className="bg-purple-100 text-purple-700 text-sm font-bold px-2 py-0.5 rounded-full">
          {totalQuantity} items
        </span>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTADO DE ITEMS */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium text-gray-600">Tu carrito está vacío</h2>
              <Button onClick={() => navigate('/')} fullWidth={false} className="mt-4">
                Ir a Productos
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                   <ShoppingBag className="text-gray-400 w-8 h-8" />
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Cantidad: <span className="font-medium text-gray-700">{item.quantity}</span></p>
                    <p>Sub Total: <span className="font-medium text-gray-700">${(item.currentUnitPrice * item.quantity).toFixed(2)}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button onClick={() => decreaseQty(item.id)} className="p-1 hover:bg-gray-200 rounded text-gray-600">
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)} className="p-1 hover:bg-gray-200 rounded text-gray-600">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button onClick={() => removeItem(item.productId || item.id)} className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-2 rounded-lg text-sm font-medium">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RESUMEN DE COMPRA */}
        {cartItems.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detalle de pedido</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Cantidad total:</span>
                  <span className="font-medium text-gray-900">{totalQuantity}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>Total a pagar:</span>
                  <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handleCheckoutClick} disabled={isProcessing} fullWidth={true} className="py-3 text-lg">
                {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Modal Selección */}
      {showAuthSelection && (
        <SelectionModal 
              onClose={() => setShowAuthSelection(false)}
              onLoginClick={() => { setShowAuthSelection(false); setShowLoginModal(true); }}
              onRegisterClick={() => { setShowAuthSelection(false); setShowRegisterModal(true); }}
          />
      )}

      {/* 2. Modal Login (REFACTORIZADO CON REACT-HOOK-FORM) */}
      {showLoginModal && (
        <LoginModal 
              onClose={() => setShowLoginModal(false)}
              onSwitchToRegister={() => { setShowLoginModal(false); setShowRegisterModal(true); }}
              onSuccess={handleAuthSuccess}
        />
      )}

      {/* 3. Modal Registro (REFACTORIZADO CON REACT-HOOK-FORM) */}
      {showRegisterModal && (
        <RegisterModal 
              onClose={() => setShowRegisterModal(false)}
              onSwitchToLogin={() => { setShowRegisterModal(false); setShowLoginModal(true); }}
              onSuccess={handleAuthSuccess}
          />
      )}

    </div>
  );
}
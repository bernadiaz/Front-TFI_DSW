import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Button from '../../Shared/Components/Button.jsx';
import {createOrder} from '../../Orders/Services/OrdersServices.js';
import noimage from '../../../Assets/noimage.svg';


export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Cargar carrito al montar el componente
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // 2. Guardar cambios en LocalStorage
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
    const newCart = cartItems.filter(item => item.productId !== id);
    updateCart(newCart);
  };

  // --- CÁLCULOS ---
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (parseFloat(item.currentUnitPrice) * item.quantity), 0);

  // --- CHECKOUT ---
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const token = localStorage.getItem('authToken');

    // 1. Validar Sesión: Si no hay token, redirigir al login
    if (!token) {
        alert("Debe iniciar sesión para completar la compra.");
        navigate('/login', {state: { from: '/cart' } });
        return;
    }

    setIsProcessing(true);

    try {
      // 2. Preparar Payload (Ajusta la estructura según tu DTO de Backend)
      const orderData = {
        items: cartItems.map(item => ({ 
            productId: item.id, 
            quantity: item.quantity,
            price: item.currentUnitPrice
        })),
        total: totalPrice
      };

      // 3. Llamada al Backend
      const response = await createOrder(orderData, token);

      if (!response.ok) {
        throw new Error('Error al procesar la orden');
      }

      // 4. Éxito
      localStorage.removeItem('cart'); // Limpiar storage
      setCartItems([]); // Limpiar estado
      alert("¡Compra realizada con éxito!");
      navigate('/'); // Volver al catálogo

    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu compra. Por favor intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
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
              {/* <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" /> */}
              <h2 className="text-xl font-medium text-gray-600">Tu carrito está vacío</h2>
              <p className="text-gray-400 mb-6">¡Agrega algunos productos!</p>
              <Button onClick={() => navigate('/')} fullWidth={false}>
                Ir a Productos
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Imagen */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                   <img src={noimage} alt="imagen del prod" className="h-full w-full object-contain"/>
                </div>

                {/* Info */}
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Cantidad: <span className="font-medium text-gray-700">{item.quantity}</span></p>
                    <p>Sub Total: <span className="font-medium text-gray-700">${(item.currentUnitPrice * item.quantity).toFixed(2)}</span></p>
                  </div>
                </div>

                {/* Controles */}
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
                  
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Borrar</span>
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

              <Button 
                onClick={handleCheckout} 
                disabled={isProcessing}
                className="w-full py-3 text-lg shadow-purple-200 shadow-lg"
              >
                {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
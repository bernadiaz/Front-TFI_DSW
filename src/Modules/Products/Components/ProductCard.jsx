import React, { useState } from 'react';
import { Minus, Plus} from 'lucide-react';
import noimage from '../../../Assets/noimage.svg';

function ProductCard({ product, onAdd }) {
  const [qty, setQty] = useState(0); // Estado local para la cantidad

  const handleIncrement = () => setQty(prev => prev + 1);
  const handleDecrement = () => setQty(prev => (prev > 0 ? prev - 1 : 0));

  const handleAddClick = () => {
    if (qty > 0) {
      onAdd(product, qty);
      setQty(0); // Resetear contador visual tras agregar
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Imagen Placeholder */}
      <div className="bg-gray-200 h-48 w-full flex items-center justify-center">
        <img src={noimage} alt="imagen del prod" className="h-full w-full object-contain"/>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        
        {/* Precio y Controles */}
        <div className="mt-auto">
          <p className="font-bold text-gray-900 mb-3">${product.currentUnitPrice}</p>
          
          <div className="flex items-center justify-between">
            {/* Control de Cantidad */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDecrement}
                className="text-gray-500 hover:text-black p-1"
              >
                <Minus size={16} />
              </button>
              
              <span className="w-4 text-center font-medium text-gray-700">
                {qty}
              </span>
              
              <button 
                onClick={handleIncrement}
                className="text-gray-500 hover:text-black p-1"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Botón Agregar */}
            <button 
              onClick={handleAddClick}
              disabled={qty === 0} // Deshabilitado si es 0
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                qty > 0 
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
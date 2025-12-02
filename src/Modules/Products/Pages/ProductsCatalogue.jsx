import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import { getProducts } from '../Services/ProductsService';


const ITEMS_PER_PAGE = 8;

export default function ProductsCatalogue() {
  const { searchTerm = '' } = useOutletContext() || {};

  const [allProducts, setAllProducts] = useState([]); // Productos ya filtrados
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const topRef = useRef(null);

  // Reiniciar a página 1 si cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (topRef.current) {
        // 'scrollIntoView' mueve el elemento al tope del contenedor scrolleable (main)
        topRef.current.scrollIntoView({ block: 'start' });
    }
  }, [currentPage]);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getProducts({
          pageNumber: 1, 
          pageSize: 1000, 
          searchTerm: '' 
        });

        if (isMounted) {
          if (result.error) {
            setError(result.error);
            setAllProducts([]);
          } else {
            const rawItems = result.data.items || (Array.isArray(result.data) ? result.data : []);
            
            const filteredItems = rawItems.filter(p => {
                // Filtro 1: Activo
                const isActive = (p.isActive === true || p.isActive === 1 || p.isActive === 'true');
                
                // Filtro 2: Búsqueda
                let matchesSearch = true;
                if (searchTerm) {
                    const term = searchTerm.toLowerCase();
                    const name = (p.name || "").toLowerCase();
                    matchesSearch = name.includes(term);
                }

                return isActive && matchesSearch;
            });
            
            setAllProducts(filteredItems);
          }
        }
      } catch (err) {
        if (isMounted) setError("Error al conectar con el servidor");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => loadData(), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // --- PAGINACIÓN ---
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentVisibleProducts = allProducts.slice(indexOfFirstItem, indexOfLastItem);

  // --- CARRITO ---
  const addToCart = (product, quantity) => {
    if (quantity < 1) return;
    const newItem = { ...product, quantity };
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const idx = currentCart.findIndex(i => i.id === product.productId);
    const updatedCart = idx >= 0 
      ? currentCart.map((item, i) => i === idx ? { ...item, quantity: item.quantity + quantity } : item)
      : [...currentCart, newItem];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`Agregado: ${quantity} x ${product.name}`);
  };

  return (
    <div ref={topRef} className="font-sans text-gray-800 w-full pb-10">
      
      {isLoading && <div className="py-20 text-center text-gray-500 animate-pulse">Cargando catálogo...</div>}
      
      {error && !isLoading && <div className="py-20 text-center text-red-500">Error: {error}</div>}

      {!isLoading && !error && (
        <>
          {currentVisibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentVisibleProducts.map(product => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              {allProducts.length === 0 && searchTerm 
                ? `No se encontraron productos para "${searchTerm}".`
                : "No hay productos disponibles."}
            </div>
          )}

          {allProducts.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span className="font-medium text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>
                <button 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                >
                    Siguiente
                </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
import Card from "../../Shared/Components/Card";
import Button from "../../Shared/Components/Button";
import Input from "../../Shared/Components/Input";
import {getProducts} from "../Services/ProductsService"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 3;

function ProductsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    
    // Estado de Paginación
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();    

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await getProducts({ pageSize: 1000 });
                
                if (response.error) {
                    setError(response.error);
                } else {
                    setProducts(response.data || []); 
                }
            } catch (err) {
                setError("Error inesperado al cargar productos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Resetear a la página 1 cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm]);

    const filteredProducts = products.filter(product => {
        let matchesStatus = true;
        if (filterStatus === "enabled") {
            matchesStatus = product.isActive === 1 || product.isActive === true;
        } else if (filterStatus === "disabled") {
            matchesStatus = product.isActive === 0 || product.isActive === false;
        }

        let matchesSearch = true;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const name = (product.name || "").toLowerCase();
            const sku = (product.sku || "").toLowerCase();
            matchesSearch = name.includes(term) || sku.includes(term);
        }

        return matchesStatus && matchesSearch;
    });

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const NavigateCreateProduct = () => {
        navigate('/admin/products/create');
    }

    return(
        <div className="flex flex-col gap-3 h-full">
            <Card className="shrink-0">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold">Products</h1>
                        <button onClick={NavigateCreateProduct} className="sm:hidden flex items-center justify-center rounded-2xl h-11 w-11 text-gray-600 hover:text-gray-800 transition-colors">            
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448" className="w-6 h-6 fill-current"><path d="M224 0C99.904 0 0 99.904 0 224s99.904 224 224 224 224-99.904 224-224S348.096 0 224 0zm0 416c-105.87 0-192-86.13-192-192S118.13 32 224 32s192 86.13 192 192-86.13 192-192 192zm-32-224H96v64h96v96h64v-96h96v-64h-96V96h-64v96z"/></svg>
                        </button>
                        <Button fullWidth={false} className="hidden sm:block rounded-md" onClick={NavigateCreateProduct}>
                            Crear Producto
                        </Button>
                    </div>
                    
                    <div className="flex flex-col gap-5 sm:grid sm:grid-cols-[auto_250px]">
                        <div className="relative w-full">
                            <input 
                                type="text" 
                                placeholder="Buscar producto por nombre o SKU" 
                                className="w-full text-base border border-gray-300 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                            </div>
                            {/* <Button fullWidth={false} className="text-white">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M19.9604 11.4802C19.9604 13.8094 19.0227 15.9176 17.5019 17.4512C16.9332 18.0247 16.2834 18.5173 15.5716 18.9102C14.3594 19.5793 12.9658 19.9604 11.4802 19.9604C6.79672 19.9604 3 16.1637 3 11.4802C3 6.79672 6.79672 3 11.4802 3C16.1637 3 19.9604 6.79672 19.9604 11.4802Z" stroke="#ffffff" strokeWidth="2"/><path d="M18.1553 18.1553L21.8871 21.8871" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/></svg>
                            </Button> */} 
                        </div>
            
                        <select 
                            className="text-base p-2 rounded-lg w-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Todos</option>
                            <option value="enabled">Activos</option>
                            <option value="disabled">Inactivos</option>
                        </select>
                    </div>
                </div>
            </Card>

            <div className="flex-1 overflow-hidden min-h-0 flex flex-col gap-2 pr-2">
                {isLoading && <p className="text-center text-gray-500 mt-4">Cargando productos...</p>}
                
                {error && <p className="text-center text-red-500 mt-4">{error}</p>}

                {!isLoading && !error && currentProducts.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No se encontraron productos.</p>
                )}

                {currentProducts.map((product) => (
                    <Card key={product.id || product.productId}> 
                        <h1 className="font-semibold">{product.sku} - {product.name}</h1> 
                        <p className="text-base">
                            {product.stockQuantity} unidades - {product.isActive ? 'Activo' : 'Inactivo'} - ${product.currentUnitPrice}
                        </p>
                    </Card>
                ))}

                {!isLoading && filteredProducts.length > 0 && (
                    <div className="flex justify-center items-center gap-4 mt-4 pb-2">
                        <button 
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        
                        <span className="font-bold text-gray-700">
                            Página {currentPage} de {totalPages || 1}
                        </span>

                        <button 
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductsPage;
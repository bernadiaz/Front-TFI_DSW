import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../Shared/Components/Card";
import Button from "../../Shared/Components/Button";
import { getOrders } from "../Services/OrdersServices"; 

const ITEMS_PER_PAGE = 2; 

function OrdersPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    
    // const navigate = useNavigate(); // Comentado si no hay router en el entorno, pero lo dejamos si existe

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await getOrders();
                
                let data = [];
                if (Array.isArray(response)) {
                    data = response;
                } else if (response.data) {
                    data = response.data;
                } else if (response.error) {
                    setError(response.error);
                }

                setOrders(data);
            } catch (err) {
                setError("Error inesperado al cargar órdenes.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm]);

    const filteredOrders = orders.filter(order => {
        let matchesStatus = true;
        if (filterStatus !== "all") {
            matchesStatus = order.status === filterStatus;
        }

        let matchesSearch = true;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            
            // CAMBIO PRINCIPAL: Usamos customerName que viene del backend
            const client = (order.customerName || order.clientName || "").toLowerCase();
            const orderId = (order.orderId || order.id || "").toString().toLowerCase();
            
            matchesSearch = client.includes(term) || orderId.includes(term);
        }

        return matchesStatus && matchesSearch;
    });

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

    return(
        <div className="flex flex-col gap-3 h-full max-w-4xl mx-auto p-4 w-full">

                <Card>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Órdenes</h1>
                        </div>
                        
                        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[auto_180px]">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="relative w-full">
                                    <input 
                                        type="text" 
                                        placeholder="Buscar por cliente o ID..." 
                                        className="w-full text-base border border-gray-300 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                
                            <select 
                                className="text-base p-2 rounded-lg w-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Todas</option>
                                <option value="PENDING">Pendientes</option>
                                <option value="PROCESSING">En Proceso</option>
                                <option value="SHIPPED">Enviadas</option>
                                <option value="DELIVERED">Entregadas</option>
                                <option value="CANCELLED">Canceladas</option>
                            </select>
                        </div>
                    </div>
                </Card>

            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-3">
                
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                
                {error && <p className="text-center text-red-500 mt-4 bg-red-50 p-3 rounded border border-red-200">{error}</p>}

                {!isLoading && !error && currentOrders.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-lg">No se encontraron órdenes.</p>
                    </div>
                )}

                {currentOrders.map((order) => {
                    // CAMBIO PRINCIPAL: Mapeo robusto de propiedades
                    const orderId = order.orderId || order.id;
                    const client = order.customerName || "Cliente Desconocido";
                    const status = order.status || "Sin estado";
                    
                    const rawTotal = order.totalAmount !== undefined ? order.totalAmount : (order.total || 0);
                    // Usamos un formato simple si Intl falla en algunos entornos antiguos, pero Intl es estandar
                    const totalFormatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(rawTotal);

                    return (
                        <Card key={orderId} className="hover:shadow-md transition-shadow group"> 
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-gray-800">#{orderId.toString().replace('ORD-', '')}</h3>
                                        <span className="text-gray-300">|</span>
                                        <span className="font-medium text-gray-700">{client}</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className={`text-xs px-2.5 py-0.5 font-semibold`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <Button 
                                        fullWidth={false} 
                                        onClick={() => alert(`Ver detalles de la orden ${orderId}`)}
                                    >
                                        Ver
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}

                {!isLoading && filteredOrders.length > 0 && (
                    <div className="flex justify-center items-center gap-4 mt-4 pb-8">
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

export default OrdersPage;
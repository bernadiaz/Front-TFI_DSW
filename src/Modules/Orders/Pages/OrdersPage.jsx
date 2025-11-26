import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../Shared/Components/Card";
import Button from "../../Shared/Components/Button";
// Asegúrate de importar el servicio correcto
import { getOrders } from "../Services/OrdersServices"; 

function OrdersPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    
    // Estados para filtros
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    
    const navigate = useNavigate();    

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await getOrders();
                
                // Manejamos si el servicio devuelve array directo o objeto { data, error }
                // Asumimos que tu getOrders devuelve el array directo según tu código anterior, 
                // pero aquí lo blindamos por si acaso.
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

    // --- LÓGICA DE FILTRADO ---
    const filteredOrders = orders.filter(order => {
        // 1. Filtro por Estado
        let matchesStatus = true;
        if (filterStatus !== "all") {
            // Compara el estado seleccionado con el estado de la orden
            // (Asegúrate que en tu DB se guarden como "PENDING", "SHIPPED", etc.)
            matchesStatus = order.status === filterStatus;
        }

        // 2. Filtro por Buscador (Nombre Cliente o ID)
        let matchesSearch = true;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            // Protegemos con || "" por si algún campo viene null
            const client = (order.clientName || "").toLowerCase();
            const orderId = (order.id || order.orderId || "").toString().toLowerCase();
            
            matchesSearch = client.includes(term) || orderId.includes(term);
        }

        return matchesStatus && matchesSearch;
    });

    return(
        <div className="flex flex-col gap-4 h-full">
            
            {/* HEADER FIJO */}
            <div>
                <Card>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Orders</h1>
                        </div>
                        
                        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[auto_180px]">
                            <div className="flex items-center gap-2 min-w-0">
                                <input 
                                    type="text" 
                                    placeholder="Buscar por cliente o ID..." 
                                    className="w-full text-[1.3rem] border border-gray-500 rounded-xs p-1"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button fullWidth={false} className="text-white">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M19.9604 11.4802C19.9604 13.8094 19.0227 15.9176 17.5019 17.4512C16.9332 18.0247 16.2834 18.5173 15.5716 18.9102C14.3594 19.5793 12.9658 19.9604 11.4802 19.9604C6.79672 19.9604 3 16.1637 3 11.4802C3 6.79672 6.79672 3 11.4802 3C16.1637 3 19.9604 6.79672 19.9604 11.4802Z" stroke="#ffffff" strokeWidth="2"/><path d="M18.1553 18.1553L21.8871 21.8871" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/></svg>
                                </Button>
                            </div>
                
                            <select 
                                className="text-[1.1rem] p-2 rounded w-full border border-gray-500"
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
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-2 pr-2">
                
                {isLoading && <p className="text-center text-gray-500 mt-4">Cargando órdenes...</p>}
                
                {error && <p className="text-center text-red-500 mt-4">{error}</p>}

                {!isLoading && !error && filteredOrders.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No se encontraron órdenes.</p>
                )}

                {filteredOrders.map((order) => {
                    const orderId = order.id || order.orderId;
                    const client = order.clientName || "Cliente Desconocido";
                    const status = order.status || "Sin estado";
                    const total = order.total || order.totalAmount || 0;

                    return (
                        <Card key={orderId}> 
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="font-bold text-lg">#{orderId} - {client}</h1> 
                                    <p className="text-base text-gray-600 font-medium">
                                        <span>{status}</span> 
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${total}</p>
                                    {/* Botón Ver detalle (Opcional) */}
                                    <Button 
                                        fullWidth={false} 
                                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs px-3 py-1 mt-1 rounded"
                                        onClick={() => alert(`Ver detalles orden #${orderId}`)}
                                    >
                                        Ver
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

export default OrdersPage;
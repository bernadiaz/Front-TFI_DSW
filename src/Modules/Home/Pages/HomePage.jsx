import { useEffect, useState } from "react";
import Card from "../../Shared/Components/Card.jsx";
import { getProducts } from "../../Products/Services/ProductsService.js";
import { getOrders } from "../../Orders/Services/OrdersServices.js";

function HomePage() {
    const [stats, setStats] = useState({ products: 0, orders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, ordersData] = await Promise.all([
                    getProducts({ pageSize: 10000, pageNumber: 1 }), 
                    getOrders()
                ]);

                // 1. Manejo de Productos
                let productCount = 0;
                if (!productsResponse.error && productsResponse.data) {
                    productCount = productsResponse.data.length;
                }

                // 2. Manejo de Órdenes (getOrders retorna la data directa o lanza error)
                let orderCount = 0;
                if (Array.isArray(ordersData)) {
                    orderCount = ordersData.length;
                }

                setStats({ products: productCount, orders: orderCount });

            } catch (error) {
                console.error("Error cargando dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Home Page</h1>
            <div className="flex flex-col gap-3">
                <Card>
                    <h1 className="font-semibold">Productos</h1>
                    <div className="flex gap-1">
                        <p>Cantidad de Productos:</p> 
                        {loading ? "..." : stats.products}
                    </div>
                </Card>
                <Card>
                    <h1 className="font-semibold">Ordenes</h1>
                    <div className="flex gap-1">
                        <p>Cantidad de Ordenes: </p>
                        {loading ? "..." : stats.orders}
                    </div>
                </Card>
            </div>
        </>
    );
}

export default HomePage;
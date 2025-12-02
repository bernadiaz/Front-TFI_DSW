export const getOrders = async () => {
    const token = localStorage.getItem('authToken');

    const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });

    if (response.status === 401) {
        throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
    }

    if (!response.ok) {
        throw new Error("Error al obtener las órdenes");
    }

    return await response.json();
};
export const createOrder = async (orderData, token) => {
    try {
        const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
        return await response.json();
    } catch (error) {
        throw error;
    }
};
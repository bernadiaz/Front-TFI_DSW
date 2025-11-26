export const getProducts = async () => {
  try {
    // const token = localStorage.getItem('authToken');

    const response = await fetch('/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // este endpoint no necesita autorizacion
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); 
      return { data: null, error: errorData.message || 'Error al obtener los productos.' };
    }

    const data = await response.json();

    return { data: data, error: null };

  } catch (err) {
    console.error(err);
    return { data: null, error: "No se pudo conectar con el servidor." };
  }
};

export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      // 1. Leemos el cuerpo como TEXTO primero (para no fallar si no es JSON)
      const textBody = await response.text();
      let errorData = null;
      
      try {
          // 2. Intentamos parsearlo a JSON manualmente
          if (textBody) {
              errorData = JSON.parse(textBody);
          }
      } catch (e) {
          // Si falla el parseo, significa que el backend devolvió texto plano.
          // Guardamos el texto tal cual en errorData.
          errorData = textBody;
      }

      let errorMessage = `Error ${response.status}: No se pudo crear el producto.`;

      // 3. Lógica de extracción del mensaje
      if (errorData) {
          // CASO A: El error es un STRING directo (Texto plano)
          // Ej: return BadRequest("El SKU ya existe");
          if (typeof errorData === 'string') {
              errorMessage = errorData;
          } 
          // CASO B: Es un OBJETO JSON (ProblemDetails, etc.)
          else if (typeof errorData === 'object') {
              if (errorData.detail) {
                  errorMessage = errorData.detail;
              } 
              else if (errorData.errors) {
                  errorMessage = Object.values(errorData.errors).flat().join('. ');
              }
              else if (errorData.message) {
                  errorMessage = errorData.message;
              }
              else if (errorData.title) {
                  errorMessage = errorData.title;
              }
          }
      }
      
      return { success: false, error: errorMessage };
    }

    // Éxito: Leemos la respuesta (si hay)
    const textResponse = await response.text();
    const data = textResponse ? JSON.parse(textResponse) : {};
    
    return { success: true, data: data };

  } catch (err) {
    console.error(err);
    return { success: false, error: "Error de conexión. Verifique si el servidor está encendido." };
  }
};
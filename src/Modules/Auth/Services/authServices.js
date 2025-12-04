export const loginUser = async (username, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    // CASO 1: ÉXITO (Status 200-299)
    if (response.ok) {
      const data = await response.json();
      return { data, error: null };
    } 
    
    // CASO 2: ERROR DEL SERVIDOR (Status 400, 500, etc.)
    else {
      let errorMsg = "Error desconocido";
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // Es JSON (ej. validación fallida)
        const error = await response.json();
        errorMsg = error.detail || error.title || "Error desconocido";
      } else {
        // NO es JSON (ej. Error 500 fatal texto plano)
        const text = await response.text();
        
        if (text && text.trim().length > 0) {
          errorMsg = "Error: " + text;
        } else {
          errorMsg = `Error ${response.status}: ${response.statusText || "Solicitud fallida"}`;
        }



      }
      
      // Retornamos el error para que el componente lo maneje
      return { data: null, error: errorMsg };
    }

  } catch (err) {
    // CASO 3: ERROR DE RED (Servidor apagado, DNS, etc)
    console.error(err);
    // No podemos usar setErrorMessage aquí porque esto no es un componente React
    return { data: null, error: "No se pudo conectar con el servidor. Verifica tu conexión." };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const textBody = await response.text();
    let data = null;

    try {
        if (textBody) {
            data = JSON.parse(textBody);
        }
    } catch (e) {
        console.warn("La respuesta no es JSON válido, se usará como texto.");
        data = { message: textBody }; 
    }

    if (response.ok) {
      return { data: data, error: null };
    } 
    
    else {
      console.log("Error del Backend:", data);
      
      let errorMsg = "Error desconocido";

      if (typeof data === 'string') {
          errorMsg = data; 
      } else if (data) {
          errorMsg = data.detail || data.message || data.title || "Error al procesar la solicitud";
          
          if (data.errors) {
              errorMsg = Object.values(data.errors).flat().join('. ');
          }
      }

      return { data: null, error: errorMsg };
    }

  } catch (err) {
    console.error(err);
    return { data: null, error: "No se pudo conectar con el servidor. Verifica tu conexión." };
  }
};

// Función auxiliar para decodificar JWT sin librerías externas
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
    }
};
export const testAuthEndpoint = async () => {
  const testData = {
    nombre: "Usuario Test",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
    telefono: "123456789",
    direccion: "Calle Test 123",
    fechaNacimiento: "1990-01-01",
  };

  try {
    console.log(" Probando endpoint de registro...");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log(" Respuesta del servidor:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text().catch(() => "No se pudo leer el cuerpo"),
    });

    return {
      success: response.ok,
      status: response.status,
      data: await response.json().catch(() => null),
    };
  } catch (error) {
    console.error("Error en prueba:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

export const testApiConnection = async () => {
  try {
    const response = await fetch("/api");
    return {
      connected: response.ok,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

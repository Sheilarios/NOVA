import React, { useState } from "react";
import { testAuthEndpoint, testApiConnection } from "../../utils/apiTester";

const ApiDebug: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestConnection = async () => {
    setLoading(true);
    const connectionResult = await testApiConnection();
    setResult({ type: "connection", ...connectionResult });
    setLoading(false);
  };

  const handleTestAuth = async () => {
    setLoading(true);
    const authResult = await testAuthEndpoint();
    setResult({ type: "auth", ...authResult });
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>🔧 Debug de API</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={handleTestConnection} disabled={loading}>
          Probar Conexión API
        </button>
        <button onClick={handleTestAuth} disabled={loading}>
          Probar Registro
        </button>
      </div>

      {loading && <p>Procesando...</p>}

      {result && (
        <div
          style={{
            padding: "15px",
            backgroundColor: result.success ? "#e8f5e9" : "#ffebee",
            borderRadius: "5px",
          }}
        >
          <h4>
            Resultado {result.type === "connection" ? "Conexión" : "Registro"}:
          </h4>
          <pre
            style={{
              overflow: "auto",
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "3px",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiDebug;

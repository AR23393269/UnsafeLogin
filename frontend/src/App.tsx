import { useState } from "react";
import { useEffect } from "react";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Bienvenido from "./components/Bienvenido";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

function App() {
  const [vista, setVista] = useState<"login" | "registro" | "bienvenido">("login");
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const handleLogin = (user: Usuario) => {
    setUsuario(user);
    setVista("bienvenido");
  };

  const handleRegistro = () => {
    setVista("login");
  };

  const handleLogout = () => {
    setUsuario(null);
    setVista("login");
  };

  useEffect(() => {
  const obtenerIP = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mi-ip`
      );
      const data = await res.json();

      console.log(
        `ESTOY OBSERVANDO TU IP: ${data.ip}`
      );
    } catch {
      console.log("No se pudo obtener IP");
    }
  };

  obtenerIP();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center p-4">
      {vista === "login" && (
        <Login onLogin={handleLogin} onIrARegistro={() => setVista("registro")} />
      )}
      {vista === "registro" && (
        <Registro onRegistro={handleRegistro} onIrALogin={() => setVista("login")} />
      )}
      {vista === "bienvenido" && usuario && (
        <Bienvenido usuario={usuario} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
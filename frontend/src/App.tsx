import { useState } from "react";
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
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Props {
  onRegistro: () => void;
  onIrALogin: () => void;
}

export default function Registro({ onRegistro, onIrALogin }: Props) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setExito("");
    setCargando(true);

    try {
      const res = await fetch(`${API_URL}/api/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear cuenta.");
        return;
      }

      setExito("Cuenta creada con exito. Redirigiendo al login...");
      setTimeout(() => onRegistro(), 2000);
    } catch {
      setError("No se pudo conectar al servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
        <h2 className="text-3xl font-bold text-cyan-400 text-center mb-2">
          Crear Cuenta
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Registrate para acceder
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Correo
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Contrasena
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Tu contrasena"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
              {error}
            </p>
          )}

          {exito && (
            <p className="text-green-400 text-sm text-center bg-green-400/10 py-2 rounded-lg">
              {exito}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 transition-all duration-300 rounded-xl font-semibold shadow-lg hover:scale-105 disabled:hover:scale-100 text-white"
          >
            {cargando ? "Creando..." : "Crear Cuenta"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Ya tienes cuenta?{" "}
          <button
            onClick={onIrALogin}
            className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors"
          >
            Iniciar sesion
          </button>
        </p>
      </div>
    </div>
  );
}
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Props {
  onLogin: (usuario: { id: number; nombre: string; correo: string }) => void;
  onIrARegistro: () => void;
}

export default function Login({ onLogin, onIrARegistro }: Props) {
  const [identificador, setIdentificador] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificador, contrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesion.");
        return;
      }

      onLogin(data.usuario);
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
          Iniciar Sesion
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Ingresa con tu nombre o correo
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Nombre o Correo
            </label>
            <input
              type="text"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              placeholder="tu nombre o correo"
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
              placeholder="tu contrasena"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 transition-all duration-300 rounded-xl font-semibold shadow-lg hover:scale-105 disabled:hover:scale-100 text-white"
          >
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          No tienes cuenta?{" "}
          <button
            onClick={onIrARegistro}
            className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
}
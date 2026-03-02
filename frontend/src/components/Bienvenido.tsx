import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Nota {
  id: number;
  usuario_id: number;
  titulo: string;
  contenido: string;
  creado_en: string;
  actualizado_en: string;
}

interface Props {
  usuario: { id: number; nombre: string; correo: string };
  onLogout: () => void;
}

export default function Bienvenido({ usuario, onLogout }: Props) {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const fetchNotas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notas/${usuario.id}`);
      const data = await res.json();
      setNotas(data);
    } catch {
      setError("Error al cargar notas.");
    }
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  const limpiarForm = () => {
    setTitulo("");
    setContenido("");
    setEditandoId(null);
    setError("");
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      if (editandoId) {
        // Editar
        const res = await fetch(`${API_URL}/api/notas/${editandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_id: usuario.id, titulo, contenido }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Error al editar nota.");
          return;
        }
      } else {
        // Crear
        const res = await fetch(`${API_URL}/api/notas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_id: usuario.id, titulo, contenido }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Error al crear nota.");
          return;
        }
      }

      limpiarForm();
      await fetchNotas();
    } catch {
      setError("No se pudo conectar al servidor.");
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (nota: Nota) => {
    setTitulo(nota.titulo);
    setContenido(nota.contenido);
    setEditandoId(nota.id);
    setError("");
  };

  const handleEliminar = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/notas/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: usuario.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al eliminar nota.");
        return;
      }
      if (editandoId === id) limpiarForm();
      await fetchNotas();
    } catch {
      setError("No se pudo conectar al servidor.");
    }
  };

  const handleCancelar = () => {
    limpiarForm();
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {usuario.nombre.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {"Hola, "}{usuario.nombre}
              </h2>
              <p className="text-gray-400 text-sm">{usuario.correo}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-400 transition-all duration-300 rounded-xl text-sm font-semibold text-white"
          >
            Salir
          </button>
        </div>

        {/* Formulario de nota */}
        <form onSubmit={handleGuardar} className="mb-8">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">
            {editandoId ? "Editar Nota" : "Nueva Nota"}
          </h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Titulo de la nota"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              required
            />
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe tu nota aqui..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
              required
            />

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 transition-all duration-300 rounded-xl font-semibold shadow-lg hover:scale-105 disabled:hover:scale-100 text-white"
              >
                {cargando
                  ? "Guardando..."
                  : editandoId
                  ? "Guardar Cambios"
                  : "Agregar Nota"}
              </button>
              {editandoId && (
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 transition-all duration-300 rounded-xl font-semibold text-white"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Lista de notas */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">
            {"Mis Notas"}{" "}
            <span className="text-gray-500 text-sm font-normal">
              ({notas.length})
            </span>
          </h3>

          {notas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tienes notas todavia.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
              {notas.map((nota) => (
                <div
                  key={nota.id}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold truncate">
                        {nota.titulo}
                      </h4>
                      <p className="text-gray-400 text-sm mt-1 whitespace-pre-wrap break-words">
                        {nota.contenido}
                      </p>
                      <p className="text-gray-600 text-xs mt-2">
                        {new Date(nota.actualizado_en).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEditar(nota)}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 transition-colors rounded-lg text-xs font-medium text-white"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(nota.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 transition-colors rounded-lg text-xs font-medium text-white"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
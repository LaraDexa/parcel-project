import { createContext, useContext, useState, useEffect } from "react";

const ParcelsContext = createContext();

export function ParcelsProvider({ children }) {
  // 🌾 Parcelas activas y eliminadas
  const [parcelas, setParcelas] = useState([]);
  const [parcelasEliminadas, setParcelasEliminadas] = useState([]);

  // 📦 Cargar desde localStorage al iniciar
  useEffect(() => {
    const storedParcelas = JSON.parse(localStorage.getItem("parcelas")) || [];
    const storedDeleted = JSON.parse(localStorage.getItem("parcelasEliminadas")) || [];

    setParcelas(storedParcelas);
    setParcelasEliminadas(storedDeleted);
  }, []);

  // 💾 Guardar en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("parcelas", JSON.stringify(parcelas));
  }, [parcelas]);

  useEffect(() => {
    localStorage.setItem("parcelasEliminadas", JSON.stringify(parcelasEliminadas));
  }, [parcelasEliminadas]);

  // ➕ Agregar o actualizar parcela (evita duplicados)
  const addParcela = (nuevaParcela) => {
    setParcelas((prev) => {
      const existe = prev.some((p) => p.id === nuevaParcela.id);
      if (existe) {
        // 🧩 Si ya existe, actualiza sus datos
        return prev.map((p) => (p.id === nuevaParcela.id ? { ...p, ...nuevaParcela } : p));
      }
      return [...prev, nuevaParcela];
    });
  };

  // ✏️ Editar parcela existente
  const editParcela = (id, datosActualizados) => {
    setParcelas((prev) => prev.map((p) => (p.id === id ? { ...p, ...datosActualizados } : p)));
  };

  // ❌ Eliminar parcela (la mueve al historial)
  const deleteParcela = (id) => {
    setParcelas((prev) => {
      const eliminada = prev.find((p) => p.id === id);
      if (eliminada) {
        const registroEliminacion = {
          ...eliminada,
          fechaEliminacion: new Date().toISOString(),
        };

        // 🚫 Evitar duplicados en el historial
        setParcelasEliminadas((prevDel) => {
          const yaExiste = prevDel.some((p) => p.id === registroEliminacion.id);
          return yaExiste ? prevDel : [...prevDel, registroEliminacion];
        });
      }

      // 🧹 Quitar del array principal
      return prev.filter((p) => p.id !== id);
    });
  };

  // ♻️ Restaurar parcela eliminada (sin duplicar)
  const restoreParcela = (id) => {
    setParcelasEliminadas((prevDel) => {
      const restaurada = prevDel.find((p) => p.id === id);
      if (restaurada) {
        setParcelas((prev) => {
          const yaExiste = prev.some((x) => x.id === restaurada.id);
          if (!yaExiste) {
            return [...prev, { ...restaurada, fechaEliminacion: undefined }];
          }
          return prev; // No la agrega si ya está
        });
        return prevDel.filter((p) => p.id !== id);
      }
      return prevDel;
    });
  };

  // 🧹 Limpiar SOLO el historial de eliminadas (ya no toca las activas)
  const clearAll = () => {
    setParcelasEliminadas([]);
    localStorage.removeItem("parcelasEliminadas");
  };

  // 🧠 Contexto compartido
  return (
    <ParcelsContext.Provider
      value={{
        parcelas,
        parcelasEliminadas,
        addParcela,
        editParcela,
        deleteParcela,
        restoreParcela,
        clearAll,
      }}
    >
      {children}
    </ParcelsContext.Provider>
  );
}

// 🔹 Hook para consumir el contexto fácilmente
export const useParcels = () => useContext(ParcelsContext);

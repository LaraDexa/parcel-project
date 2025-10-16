import { createContext, useContext, useEffect, useState } from "react";
import { plotsService } from "../core/plotsService";

const ParcelsContext = createContext();

export function ParcelsProvider({ children }) {
  const [parcelas, setParcelas] = useState([]); // activos
  const [parcelasEliminadas, setParcelasEliminadas] = useState([]); // deleted
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [activos, deleted] = await Promise.all([
        plotsService.list("active"),
        plotsService.listDeleted(),
      ]);
      setParcelas(activos);
      setParcelasEliminadas(deleted);
    } catch (e) {
      setError(e?.message || "Error cargando parcelas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  // CREATE
  async function addParcela(input) {
    const created = await plotsService.create(input);
    setParcelas((prev) => [created, ...prev]);
    return created;
  }

  // UPDATE
  async function editParcela(id, input) {
    const updated = await plotsService.update(id, input);
    setParcelas((prev) => prev.map((p) => (p.id === id ? updated : p)));
    // si el status cambió a deleted por algún motivo, re-sync
    if (updated.status === "deleted") await refresh();
    return updated;
  }

  // SOFT DELETE
  async function deleteParcela(id) {
    const deleted = await plotsService.softDelete(id);
    setParcelas((prev) => prev.filter((p) => p.id !== id));
    setParcelasEliminadas((prev) => [deleted, ...prev]);
    return deleted;
  }

  // RESTORE
  async function restoreParcela(id) {
    // tu backend en PUT /api/plots/:id ya incluye { crop, responsible }
    const restored = await plotsService.update(id, { status: "active" });

    // evita duplicado si por alguna razón ya estaba en la lista
    setParcelas((prev) => [restored, ...prev.filter((p) => p.id !== id)]);
    setParcelasEliminadas((prev) => prev.filter((p) => p.id !== id));

    return restored;
  }

  // HARD DELETE (opcional, para pantalla de eliminadas)
  async function hardDeleteParcela(id) {
    await plotsService.hardDelete(id);
    setParcelasEliminadas((prev) => prev.filter((p) => p.id !== id));
  }

  async function clearAll() {
    const toRemove = [...parcelasEliminadas];

    await Promise.all(toRemove.map((p) => plotsService.hardDelete(p.id)));

    setParcelasEliminadas([]);
  }
  const value = {
    parcelas,
    parcelasEliminadas,
    loading,
    error,
    refresh,
    addParcela,
    editParcela,
    deleteParcela,
    restoreParcela,
    hardDeleteParcela,
    clearAll,
  };

  return <ParcelsContext.Provider value={value}>{children}</ParcelsContext.Provider>;
}

export function useParcels() {
  const ctx = useContext(ParcelsContext);
  if (!ctx) throw new Error("useParcels must be used within <ParcelsProvider>");
  return ctx;
}

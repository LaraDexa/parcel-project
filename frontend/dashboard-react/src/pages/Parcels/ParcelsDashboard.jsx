import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaTractor, FaExclamationTriangle } from "react-icons/fa";
import ParcelFormModal from "./ParcelFormModal";
import { useParcels } from "../../context/ParcelsContext";
import "./parcels.css";
// import { useParcels } from "../../context/ParcelsContext";

function ParcelsDashboard() {
  const { parcelas, addParcela, editParcela, deleteParcela } = useParcels();

  const [showModal, setShowModal] = useState(false);
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 📦 Guardar parcelas en localStorage (persistencia)
  const handleSave = async (formData) => {
    // formData viene de ParcelFormModal
    // { nombre, lat, lng, areaHa?, cultivoId?, responsableId? }
    const payload = {
      name: String(formData.nombre).trim(),
      lat: Number(formData.lat),
      lng: Number(formData.lng),
      areaHa: formData.areaHa ? Number(formData.areaHa) : 0,
      cropId: formData.cultivoId ? Number(formData.cultivoId) : null,
      responsibleId: formData.responsableId ? Number(formData.responsableId) : null,
    };

    if (selectedParcela) {
      await editParcela(selectedParcela.id, payload);
    } else {
      await addParcela(payload);
    }
    setShowModal(false);
    setSelectedParcela(null);
  };

  const handleDeleteRequest = (parcela) => setConfirmDelete(parcela);
  const confirmDeleteAction = async () => {
    await deleteParcela(confirmDelete.id);
    setConfirmDelete(null);
  };

  // helper seguro para Decimal | string | number
  const toNum = (v) => {
    // Prisma Decimal trae .toNumber()
    if (v && typeof v === "object" && typeof v.toNumber === "function") {
      return v.toNumber();
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const fmtCoord = (v) => {
    const n = toNum(v);
    return n == null ? "-" : n.toFixed(4);
  };

  return (
    <motion.div
      className="parcels-dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🔹 Header */}
      <header className="parcels-header">
        <h2>
          <FaTractor className="title-icon" /> Gestión de Parcelas
        </h2>
        <button
          className="btn-add"
          onClick={() => {
            setSelectedParcela(null);
            setShowModal(true);
          }}
        >
          <FaPlus /> Nueva Parcela
        </button>
      </header>

      {/* 📋 Tabla de parcelas */}
      <div className="parcels-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Cultivo</th>
              <th>Responsable</th>
              <th>Coordenadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parcelas.length > 0 ? (
              parcelas.map((p) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <td>{p.name}</td>

                  {/* ❌ p.ubicacion no existe; usa algo útil del schema, por ejemplo área */}
                  <td>{p.areaHa ?? "-"}</td>

                  <td>{p.crop?.name || "-"}</td>
                  <td>{p.responsible?.name || "-"}</td>

                  <td>
                    <small>
                      {fmtCoord(p.lat)}, {fmtCoord(p.lng)}
                    </small>
                  </td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setSelectedParcela(p);
                        setShowModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteRequest(p)}>
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No hay parcelas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🪴 Modal para agregar/editar */}
      <AnimatePresence>
        {showModal && (
          <ParcelFormModal
            parcela={selectedParcela}
            onClose={() => {
              setShowModal(false);
              setSelectedParcela(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* ⚠️ Modal de confirmación de eliminación */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-confirm glass-card"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationTriangle className="modal-warning-icon" />
              <h3>Confirmar Eliminación</h3>
              <p>
                ¿Deseas eliminar la parcela <strong>{confirmDelete.name}</strong>?
              </p>
              <div className="modal-actions">
                <button className="btn-cancelar" onClick={() => setConfirmDelete(null)}>
                  Cancelar
                </button>
                <button className="btn-confirmar" onClick={confirmDeleteAction}>
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ParcelsDashboard;

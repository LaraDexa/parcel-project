import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaTractor, FaExclamationTriangle } from "react-icons/fa";
import ParcelFormModal from "./ParcelFormModal";
import { useParcels } from "../../context/ParcelsContext";
import "./parcels.css";

function ParcelsDashboard() {
  const { parcelas, addParcela, editParcela, deleteParcela, parcelasEliminadas } = useParcels();

  const [showModal, setShowModal] = useState(false);
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 📦 Guardar parcelas en localStorage (persistencia)
  useEffect(() => {
    localStorage.setItem("parcelas", JSON.stringify(parcelas));
  }, [parcelas]);

  useEffect(() => {
    localStorage.setItem("parcelasEliminadas", JSON.stringify(parcelasEliminadas));
  }, [parcelasEliminadas]);

  // 🧩 Guardar o editar
  const handleSave = (formData) => {
    if (selectedParcela) {
      editParcela({ ...selectedParcela, ...formData });
    } else {
      const newParcela = {
        id: Date.now(),
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
      };
      addParcela(newParcela);
    }

    setShowModal(false);
    setSelectedParcela(null);
  };

  // 🗑️ Confirmar eliminación
  const handleDeleteRequest = (parcela) => {
    setConfirmDelete(parcela);
  };

  const confirmDeleteAction = () => {
    deleteParcela(confirmDelete.id); // 🔁 Elimina también del mapa
    setConfirmDelete(null);
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
                  <td>{p.nombre}</td>
                  <td>{p.ubicacion}</td>
                  <td>{p.cultivo}</td>
                  <td>{p.responsable}</td>
                  <td>
                    <small>
                      {p.lat?.toFixed(4)}, {p.lng?.toFixed(4)}
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
                ¿Deseas eliminar la parcela <strong>{confirmDelete.nombre}</strong>?
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

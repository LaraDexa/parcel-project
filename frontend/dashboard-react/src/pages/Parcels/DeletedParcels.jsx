import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrashAlt,
  FaRegSadTear,
  FaClock,
  FaUndo,
  FaBroom,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useParcels } from "../../context/ParcelsContext";
import "./parcels.css";

function DeletedParcels() {
  const { parcelasEliminadas, restoreParcela, clearAll } = useParcels();

  // Estados para mostrar modales
  const [confirmRestore, setConfirmRestore] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <motion.div
      className="deleted-parcels-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* 🔹 Encabezado */}
      <div className="deleted-header">
        <h2>
          <FaTrashAlt className="deleted-icon" /> Parcelas Eliminadas
        </h2>
        <p className="deleted-subtitle">Historial de terrenos que fueron removidos del sistema</p>
      </div>

      {/* 🧹 Botón de limpiar historial */}
      {parcelasEliminadas.length > 0 && (
        <div className="deleted-actions">
          <button className="btn-restore-all" onClick={() => setConfirmClear(true)}>
            <FaBroom /> Limpiar historial
          </button>
        </div>
      )}

      {/* 📊 Tabla de eliminadas */}
      {parcelasEliminadas.length > 0 ? (
        <div className="deleted-table-container">
          <motion.table
            className="deleted-table glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Cultivo</th>
                <th>Responsable</th>
                <th>Fecha de eliminación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {parcelasEliminadas.map((p) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{p.nombre}</td>
                  <td>{p.ubicacion}</td>
                  <td>{p.cultivo}</td>
                  <td>{p.responsable || "—"}</td>
                  <td className="fecha">
                    <FaClock className="clock-icon" />{" "}
                    {new Date(p.fechaEliminacion).toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>
                    <button className="btn-restore" onClick={() => setConfirmRestore(p)}>
                      <FaUndo /> Restaurar
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      ) : (
        // 😔 Sin parcelas eliminadas
        <motion.div
          className="no-deleted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FaRegSadTear className="no-deleted-icon" />
          <p>No hay parcelas eliminadas registradas.</p>
        </motion.div>
      )}

      {/* ⚠️ Modal Confirmar Restauración */}
      <AnimatePresence>
        {confirmRestore && (
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
              <h3>Confirmar Restauración</h3>
              <p>
                ¿Deseas restaurar la parcela <strong>{confirmRestore.nombre}</strong>?
              </p>
              <div className="modal-actions">
                <button className="btn-cancelar" onClick={() => setConfirmRestore(null)}>
                  Cancelar
                </button>
                <button
                  className="btn-confirmar"
                  onClick={() => {
                    restoreParcela(confirmRestore.id);
                    setConfirmRestore(null);
                  }}
                >
                  Restaurar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧹 Modal Confirmar Limpieza */}
      <AnimatePresence>
        {confirmClear && (
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
              <h3>Limpiar Historial</h3>
              <p>¿Deseas eliminar permanentemente todas las parcelas del historial?</p>
              <div className="modal-actions">
                <button className="btn-cancelar" onClick={() => setConfirmClear(false)}>
                  Cancelar
                </button>
                <button
                  className="btn-confirmar"
                  onClick={() => {
                    clearAll();
                    setConfirmClear(false);
                  }}
                >
                  Eliminar Todo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DeletedParcels;

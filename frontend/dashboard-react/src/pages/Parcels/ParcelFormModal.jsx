import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLeaf, FaMapMarkerAlt } from "react-icons/fa";
import { useParcels } from "../../context/ParcelsContext";
import "./parcels.css";

function ParcelFormModal({ parcela, onClose }) {
  const { addParcela } = useParcels();

  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    cultivo: "",
    responsable: "",
    lat: "",
    lng: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  // 🧭 Obtener coordenadas del usuario automáticamente
  useEffect(() => {
    if (!parcela) {
      setLoadingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setForm((prev) => ({
              ...prev,
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6),
            }));
            setLoadingLocation(false);
          },
          (error) => {
            console.error("Error al obtener ubicación:", error);
            setLoadingLocation(false);
          }
        );
      } else {
        console.warn("Geolocalización no soportada por el navegador");
        setLoadingLocation(false);
      }
    }
  }, [parcela]);

  // 🔹 Si hay una parcela existente, precargar los datos
  useEffect(() => {
    if (parcela) setForm(parcela);
  }, [parcela]);

  // 🔹 Manejar cambios del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 Guardar parcela y actualizar contexto
  const handleSubmit = (e) => {
    e.preventDefault();

    const newParcel = {
      id: parcela ? parcela.id : Date.now(),
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
    };

    addParcela(newParcel); // ⬅️ Se agrega directamente al contexto global
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-parcel glass-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 🪴 Encabezado */}
          <div className="modal-header">
            <FaLeaf className="modal-icon" />
            <h3>{parcela ? "Editar Parcela" : "Registrar Nueva Parcela"}</h3>
            <button onClick={onClose} className="close-btn">
              <FaTimes />
            </button>
          </div>

          {/* 🧾 Formulario */}
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Nombre de la parcela</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Rancho Verde"
                required
              />
            </div>

            <div className="form-group">
              <label>Ubicación geográfica</label>
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Cancún, QRoo"
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de cultivo</label>
              <input
                type="text"
                name="cultivo"
                value={form.cultivo}
                onChange={handleChange}
                placeholder="Ej: Maíz, Trigo, Cebada"
                required
              />
            </div>

            <div className="form-group">
              <label>Responsable</label>
              <input
                type="text"
                name="responsable"
                value={form.responsable}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            {/* 🌎 Coordenadas (solo lectura si se detectan automáticamente) */}
            <div className="form-group coords-group">
              <label>
                <FaMapMarkerAlt className="coord-icon" /> Coordenadas
              </label>
              <div className="coords-row">
                <input
                  type="text"
                  name="lat"
                  value={form.lat}
                  onChange={handleChange}
                  placeholder="Latitud"
                  readOnly={loadingLocation}
                  required
                />
                <input
                  type="text"
                  name="lng"
                  value={form.lng}
                  onChange={handleChange}
                  placeholder="Longitud"
                  readOnly={loadingLocation}
                  required
                />
              </div>
              {loadingLocation && (
                <small className="coords-loading">Obteniendo ubicación actual...</small>
              )}
            </div>

            {/* 🌿 Botones */}
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancelar">
                Cancelar
              </button>
              <button type="submit" className="btn-confirmar">
                Guardar
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ParcelFormModal;

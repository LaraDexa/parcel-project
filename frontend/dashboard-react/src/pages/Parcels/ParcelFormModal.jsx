// src/pages/Parcels/ParcelFormModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLeaf, FaMapMarkerAlt } from "react-icons/fa";
import "./parcels.css";
import { apiUrl } from "../../core/config";

function ParcelFormModal({ parcela, onClose, onSave }) {
  // estado controlado
  const [form, setForm] = useState({
    nombre: "",
    lat: "",
    lng: "",
    areaHa: "",
    cultivoId: "",
    responsableId: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  // listas de selects
  const [crops, setCrops] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [error, setError] = useState(null);

  // geo solo al crear
  useEffect(() => {
    if (!parcela && navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6),
          }));
          setLoadingLocation(false);
        },
        () => setLoadingLocation(false)
      );
    }
  }, [parcela]);

  // precarga si edita
  useEffect(() => {
    if (parcela) {
      setForm({
        nombre: parcela.name ?? "",
        lat: parcela.lat?.toString() ?? "",
        lng: parcela.lng?.toString() ?? "",
        areaHa: parcela.areaHa != null ? parcela.areaHa.toString() : "",
        cultivoId: parcela.crop?.id != null ? String(parcela.crop.id) : "",
        responsableId: parcela.responsible?.id != null ? String(parcela.responsible.id) : "",
      });
    }
  }, [parcela]);

  // carga cultivos
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCrops(true);
        const res = await fetch(apiUrl("/crops"));
        const data = await res.json();
        if (mounted) setCrops(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setError("No se pudieron cargar los cultivos");
      } finally {
        if (mounted) setLoadingCrops(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // carga usuarios (para el select de responsable)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch(apiUrl("/users"));
        const data = await res.json();
        if (mounted) setUsers(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setError("No se pudieron cargar los usuarios");
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const lat = Number(form.lat);
    const lng = Number(form.lng);
    if (!form.nombre.trim()) return setError("El nombre de la parcela es obligatorio.");
    if (Number.isNaN(lat) || Number.isNaN(lng))
      return setError("Latitud y longitud deben ser numéricas.");

    onSave({
      nombre: form.nombre.trim(),
      lat,
      lng,
      areaHa: form.areaHa ? Number(form.areaHa) : undefined,
      cultivoId: form.cultivoId ? Number(form.cultivoId) : undefined,
      responsableId: form.responsableId ? Number(form.responsableId) : undefined,
    });
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
          <div className="modal-header">
            <FaLeaf className="modal-icon" />
            <h3>{parcela ? "Editar Parcela" : "Registrar Nueva Parcela"}</h3>
            <button onClick={onClose} className="close-btn" type="button">
              <FaTimes />
            </button>
          </div>

          {error && (
            <div className="alert" style={{ color: "#ff9b9b", marginBottom: 12 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="modal-form">
            {/* Nombre */}
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

            {/* Área */}
            <div className="form-group">
              <label>Área (ha)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="areaHa"
                value={form.areaHa}
                onChange={handleChange}
                placeholder="Ej: 12.50"
              />
            </div>

            {/* Cultivo: select con mismo look (usa .select-like para la flecha) */}
            <div className="form-group select-like">
              <label>Cultivo</label>
              <select
                name="cultivoId"
                value={form.cultivoId}
                onChange={handleChange}
                disabled={loadingCrops}
              >
                <option value="">— Sin cultivo —</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {loadingCrops && <small>Cargando cultivos…</small>}
            </div>

            {/* Responsable: select por nombre */}
            <div className="form-group select-like">
              <label>Responsable</label>
              <select
                name="responsableId"
                value={form.responsableId}
                onChange={handleChange}
                disabled={loadingUsers}
              >
                <option value="">— Sin responsable —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {/* o `${u.name} (${u.email})` si quieres */}
                  </option>
                ))}
              </select>
              {loadingUsers && <small>Cargando usuarios…</small>}
            </div>

            {/* Coordenadas */}
            <div className="form-group coords-group">
              <label>
                <FaMapMarkerAlt className="coord-icon" /> Coordenadas
              </label>
              <div className="coords-row" style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  step="0.000001"
                  name="lat"
                  value={form.lat}
                  onChange={handleChange}
                  placeholder="Latitud"
                  required
                  readOnly={loadingLocation}
                />
                <input
                  type="number"
                  step="0.000001"
                  name="lng"
                  value={form.lng}
                  onChange={handleChange}
                  placeholder="Longitud"
                  required
                  readOnly={loadingLocation}
                />
              </div>
              {loadingLocation && (
                <small className="coords-loading">Obteniendo ubicación actual...</small>
              )}
            </div>

            {/* Acciones */}
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

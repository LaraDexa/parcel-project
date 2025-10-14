// 🌿 MapDashboard Futurista Dinámico con Contexto Global
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaLeaf, FaSeedling, FaGlobeAmericas } from "react-icons/fa";
import { useParcels } from "../../context/ParcelsContext";

// Ícono personalizado brillante
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

// Animación inicial del mapa
function FlyToOnLoad({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 12, { duration: 2 });
  }, [coords, map]);
  return null;
}

function MapDashboard() {
  const { parcelas } = useParcels();

  // Si no hay parcelas, usa una ubicación por defecto
  const defaultCoords = parcelas.length
    ? [parcelas[0].lat, parcelas[0].lng]
    : [21.1619, -86.8515];

  return (
    <motion.div
      className="map-dashboard-futuristic"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="map-header">
        <FaMapMarkedAlt className="map-header-icon" />
        <h3 className="map-title">Mapa de Parcelas Activas</h3>
      </div>

      <p className="map-subtitle">
        Visualización geoespacial de tus cultivos en tiempo real{" "}
        <FaGlobeAmericas className="subtitle-icon" />
      </p>

      <div className="map-wrapper">
        <MapContainer
          center={defaultCoords}
          zoom={12}
          style={{
            height: "500px",
            width: "100%",
            borderRadius: "18px",
            boxShadow: "0 0 25px rgba(0, 255, 136, 0.15)",
            overflow: "hidden",
          }}
          scrollWheelZoom={true}
        >
          <FlyToOnLoad coords={defaultCoords} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          {parcelas.length > 0 ? (
            parcelas.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={markerIcon}>
                <Popup>
                  <div className="popup-content">
                    <div className="popup-header">
                      <FaLeaf className="popup-icon" />
                      <h4>{p.nombre}</h4>
                    </div>
                    <p>
                      Latitud: <b>{p.lat}</b> <br />
                      Longitud: <b>{p.lng}</b>
                    </p>
                    <span className="popup-status">
                      <FaSeedling className="status-icon" /> Activa
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))
          ) : (
            <></>
          )}
        </MapContainer>
      </div>
    </motion.div>
  );
}

export default MapDashboard;
 
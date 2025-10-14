import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTemperatureHigh,
  FaTint,
  FaCloudRain,
  FaSun,
  FaSpinner,
} from "react-icons/fa";
import "./Dashboard.css";

function LiveDashboard() {
  const [data, setData] = useState({
    temperatura: null,
    humedad: null,
    lluvia: null,
    radiacion_solar: null,
  });

  const [loading, setLoading] = useState(true);

  // 🔄 Obtener datos promedio del arreglo devuelto
const fetchSensorData = async (sensor) => {
  try {
    const res = await fetch(
      `https://sensores-async-api.onrender.com/api/sensors/${sensor}`,
      { cache: "no-store" }
    );

    // Leer respuesta como texto (por si el stream no está cerrado aún)
    const text = await res.text();

    // Intentar convertir manualmente a JSON
    let json;
    try {
      json = JSON.parse(text);
    } catch (err) {
      console.warn(`⚠️ No se pudo parsear JSON del sensor ${sensor}:`, err);
      return null;
    }

    // Validar que sea array y calcular promedio
    if (Array.isArray(json) && json.length > 0) {
      const values = json.map((item) => item.value);
      const avg = (
        values.reduce((acc, v) => acc + v, 0) / values.length
      ).toFixed(2);
      return avg;
    }

    return null;
  } catch (error) {
    console.error(`Error obteniendo ${sensor}:`, error);
    return null;
  }
};


  // 📡 Actualizar todos los sensores
  const updateAllSensors = async () => {
    setLoading(true);
    try {
      const [temp, hum, rain, rad] = await Promise.all([
        fetchSensorData("temperatura"),
        fetchSensorData("humedad"),
        fetchSensorData("lluvia"),
        fetchSensorData("radiacion_solar"),
      ]);

      setData({
        temperatura: temp,
        humedad: hum,
        lluvia: rain,
        radiacion_solar: rad,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateAllSensors();
    const interval = setInterval(updateAllSensors, 3000);
    return () => clearInterval(interval);
  }, []);

  const SensorCard = ({ title, value, unit, icon: Icon, color, subtitle }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="sensor-card"
      style={{ borderLeftColor: color }}
    >
      <div className="sensor-header">
        <Icon className="sensor-icon" />
        <strong>{title}</strong>
      </div>
      <div className="sensor-value">
        {loading ? (
          <FaSpinner className="spin" size={28} />
        ) : (
          <>
            <h2>{value ?? "—"}</h2>
            <p>{unit}</p>
          </>
        )}
      </div>
      <div className="sensor-status">{subtitle}</div>
    </motion.div>
  );

  return (
    <motion.div
      className="live-dashboard-futuristic"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="live-title">
        <FaSun className="live-icon" /> Sensores en Tiempo Real
      </h3>

      <div className="live-grid">
        <SensorCard
          title="Temperatura"
          value={data.temperatura}
          unit="°C"
          icon={FaTemperatureHigh}
          color="#ff6b6b"
          subtitle="Monitoreo activo"
        />
        <SensorCard
          title="Humedad"
          value={data.humedad}
          unit="%"
          icon={FaTint}
          color="#00bcd4"
          subtitle="Nivel atmosférico"
        />
        <SensorCard
          title="Lluvia"
          value={data.lluvia}
          unit="mm"
          icon={FaCloudRain}
          color="#2196f3"
          subtitle="Precipitación"
        />
        <SensorCard
          title="Radiación Solar"
          value={data.radiacion_solar}
          unit="W/m²"
          icon={FaSun}
          color="#ffc107"
          subtitle="Energía solar captada"
        />
      </div>

      <div className="connection-status">
        <div className="status-dot"></div>
        Última actualización cada <strong>3 segundos</strong>
      </div>
    </motion.div>
  );
}

export default LiveDashboard;

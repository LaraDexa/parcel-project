import { motion } from "framer-motion";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaChartArea, FaChartLine, FaWater, FaSeedling } from "react-icons/fa";
import "./Dashboard.css";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function HistoryDashboard() {
  const tempData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Temperatura (°C)",
        data: [25, 27, 28, 26, 30, 29, 31],
        borderColor: "#00ff88",
        backgroundColor: "rgba(0, 255, 136, 0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const humidityData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Humedad (%)",
        data: [60, 65, 63, 67, 70, 68, 72],
        backgroundColor: "rgba(0, 255, 255, 0.4)",
        borderRadius: 6,
      },
    ],
  };

  const cropData = {
    labels: ["Maíz", "Trigo", "Cebada", "Sorgo"],
    datasets: [
      {
        label: "Distribución de Cultivos",
        data: [40, 25, 20, 15],
        backgroundColor: [
          "#00ff88",
          "#00bfa5",
          "#8bc34a",
          "#cddc39",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: { color: "#ccffd9", font: { size: 12 } },
      },
    },
    scales: {
      x: { ticks: { color: "#aaffcc" }, grid: { color: "rgba(0,255,136,0.1)" } },
      y: { ticks: { color: "#aaffcc" }, grid: { color: "rgba(0,255,136,0.1)" } },
    },
  };

  return (
    <motion.div
      className="history-dashboard-futuristic"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h3
        className="history-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <FaChartArea className="title-icon" />
        Histórico de Sensores
      </motion.h3>

      <div className="history-grid">
        {/* TEMPERATURA */}
        <motion.div
          className="chart-card-futuristic"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="chart-header">
            <FaChartLine color="#00ff88" size={22} />
            <h5>Temperatura (°C)</h5>
          </div>
          <Line data={tempData} options={chartOptions} />
        </motion.div>

        {/* HUMEDAD */}
        <motion.div
          className="chart-card-futuristic"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="chart-header">
            <FaWater color="#00bcd4" size={22} />
            <h5>Humedad (%)</h5>
          </div>
          <Bar data={humidityData} options={chartOptions} />
        </motion.div>

        {/* CULTIVOS */}
        <motion.div
          className="chart-card-futuristic"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="chart-header">
            <FaSeedling color="#8bc34a" size={22} />
            <h5>Distribución de Cultivos</h5>
          </div>
          <Pie
            data={cropData}
            options={{
              plugins: { legend: { labels: { color: "#ccffd9" } } },
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HistoryDashboard;

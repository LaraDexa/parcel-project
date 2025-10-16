import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSeedling,
  FaChartLine,
  FaMapMarkedAlt,
  FaTrashAlt,
  FaTractor,
  FaSatellite,
} from "react-icons/fa";
import "./Dashboard.css";

function DashboardMain() {
  return (
    <div className="dashboard-container-futuristic">
      {/* HEADER */}
      <motion.header
        className="dashboard-header-futuristic"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="dashboard-title">
          <FaSatellite size={28} color="#00ff88" />
          <h2>
            Agro<span>DevOps</span> Dashboard
          </h2>
        </div>
        <p className="subtitle">Monitoreo inteligente de parcelas en tiempo real</p>
      </motion.header>

      {/* NAVIGATION */}
      <motion.nav
        className="dashboard-nav-futuristic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <NavLink
          to="/dashboard/live"
          className={({ isActive }) => `nav-item-futuristic ${isActive ? "active" : ""}`}
        >
          <FaSeedling /> <span>En Vivo</span>
        </NavLink>

        <NavLink
          to="/dashboard/history"
          className={({ isActive }) => `nav-item-futuristic ${isActive ? "active" : ""}`}
        >
          <FaChartLine /> <span>Histórico</span>
        </NavLink>

        <NavLink
          to="/dashboard/map"
          className={({ isActive }) => `nav-item-futuristic ${isActive ? "active" : ""}`}
        >
          <FaMapMarkedAlt /> <span>Mapa</span>
        </NavLink>

        <NavLink
          to="/dashboard/parcels"
          className={({ isActive }) => `nav-item-futuristic ${isActive ? "active" : ""}`}
        >
          <FaTractor /> <span>Parcelas</span>
        </NavLink>

        <NavLink
          to="/dashboard/deleted"
          className={({ isActive }) => `nav-item-futuristic ${isActive ? "active" : ""}`}
        >
          <FaTrashAlt /> <span>Eliminadas</span>
        </NavLink>
      </motion.nav>

      {/* CONTENT AREA */}
      <motion.section
        className="dashboard-content-futuristic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <Outlet />
      </motion.section>
    </div>
  );
}

export default DashboardMain;

// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardMain from "./pages/Dashboard/DashboardMain";
import LiveDashboard from "./pages/Dashboard/LiveDashboard";
import HistoryDashboard from "./pages/Dashboard/HistoryDashboard";
import MapDashboard from "./pages/Dashboard/MapDashboard";

//  Contexto global para parcelas
import { ParcelsProvider } from "./context/ParcelsContext";

//  Rutas de gestión de parcelas
import ParcelsDashboard from "./pages/Parcels/ParcelsDashboard";
import DeletedParcels from "./pages/Parcels/DeletedParcels";

function AppContent() {
  const location = useLocation();

  // Oculta la navbar en login y register
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* === Rutas públicas === */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === Redirección inicial === */}
        <Route path="/" element={<Navigate to="/dashboard/live" />} />

        {/* === Dashboard principal === */}
        <Route path="/dashboard" element={<DashboardMain />}>
          <Route path="live" element={<LiveDashboard />} />
          <Route path="history" element={<HistoryDashboard />} />
          <Route path="map" element={<MapDashboard />} />
          <Route path="parcels" element={<ParcelsDashboard />} />
          <Route path="deleted" element={<DeletedParcels />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      {/* Proveedor global de parcelas (ahora todo tiene acceso al contexto) */}
      <ParcelsProvider>
        <AppContent />
      </ParcelsProvider>
    </Router>
  );
}

export default App;

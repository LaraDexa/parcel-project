// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardMain from "./pages/Dashboard/DashboardMain";
import LiveDashboard from "./pages/Dashboard/LiveDashboard";
import HistoryDashboard from "./pages/Dashboard/HistoryDashboard";
import MapDashboard from "./pages/Dashboard/MapDashboard";

// Contexto global de parcelas
import { ParcelsProvider } from "./context/ParcelsContext";

// Rutas de gestión de parcelas
import ParcelsDashboard from "./pages/Parcels/ParcelsDashboard";
import DeletedParcels from "./pages/Parcels/DeletedParcels";

// 🔒 Auth
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./core/AuthContext";

function AppContent() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirección raíz */}
        <Route path="/" element={<Navigate to="/dashboard/live" replace />} />

        {/* Protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardMain />
            </ProtectedRoute>
          }
        >
          {/* /dashboard -> /dashboard/live */}
          <Route index element={<Navigate to="live" replace />} />

          {/* Acceso para user y admin */}
          <Route
            path="live"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <LiveDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="history"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <HistoryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="map"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <MapDashboard />
              </ProtectedRoute>
            }
          />

          {/* Solo admin */}
          <Route
            path="parcels"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ParcelsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="deleted"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DeletedParcels />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard/live" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ParcelsProvider>
          <AppContent />
        </ParcelsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

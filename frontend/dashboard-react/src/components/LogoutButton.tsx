import { useAuth } from "../core/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      className="btn btn-outline-light fw-bold"
      style={{ border: "1px solid rgba(255,255,255,0.4)" }}
    >
      Cerrar sesión
    </button>
  );
}

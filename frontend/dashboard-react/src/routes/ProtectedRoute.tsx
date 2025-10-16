import { Navigate } from "react-router-dom";
import { useAuth } from "../core/AuthContext";
import type { ReactElement } from "react";

type Props = { children: ReactElement };

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center text-light m-4">Cargando…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

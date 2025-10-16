import { Navigate } from "react-router-dom";
import { useAuth } from "../core/AuthContext";
import type { ReactElement } from "react";

type Props = {
  children: ReactElement;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center text-light m-4">Cargando…</p>;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length > 0) {
    const has = user.roles?.some((r) => allowedRoles.includes(r));
    if (!has) return <Navigate to="/dashboard/live" replace />;
  }
  return children;
}

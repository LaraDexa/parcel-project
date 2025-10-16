import { createContext, useContext, useEffect, useState } from "react";
import { authService, User } from "./authService";
import { useNavigate } from "react-router-dom";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Al montar: si hay token, trae /me
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await authService.me();
        if (mounted) setUser(me);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authService.login({ email, password });
    setUser(u);
    navigate("/dashboard/live", { replace: true });
  };

  const register = async (name: string, email: string, password: string) => {
    const u = await authService.register({ name, email, password });
    setUser(u);
    navigate("/dashboard/live", { replace: true });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

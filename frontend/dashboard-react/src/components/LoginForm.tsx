import { useState } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../core/AuthContext";


function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Ingresa correo y contraseña.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email.trim(), password);
    } catch (err: any) {
      setErrorMsg(err?.message || "Credenciales inválidas.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card shadow-lg"
    >
      <div className="text-center mb-3">
        <FaLeaf size={45} color="#00c853" />
      </div>
      <h4 className="text-center mb-4 fw-bold text-light">AgroDevOps</h4>

      {errorMsg && (
        <div className="alert alert-danger py-2" role="alert">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* EMAIL */}
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            autoComplete="email"
          />
        </div>

        {/* PASSWORD + OJO */}
        <div className="mb-3 position-relative">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control pe-5"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            autoComplete="current-password"
          />
          <span
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "rgba(255,255,255,0.8)",
            }}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* BOTONES */}
        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-success fw-bold py-2"
            disabled={submitting}
            style={{
              background: "linear-gradient(90deg, #00c853, #43a047)",
              border: "none",
              opacity: submitting ? 0.8 : 1,
            }}
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>

          <Link
            to="/register"
            className="btn btn-outline-light fw-bold py-2 mt-2"
            style={{
              border: "1px solid rgba(255,255,255,0.4)",
              backdropFilter: "blur(4px)",
            }}
          >
            Registrarse
          </Link>
        </div>
      </form>
    </motion.div>
  );
}

export default LoginForm;

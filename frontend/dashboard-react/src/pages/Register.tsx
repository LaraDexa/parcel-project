import { useState } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../core/authService"; 
import "./Login.css";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

function Register() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validaciones rápidas
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setErrorMsg("Completa todos los campos requeridos.");
      return;
    }
    if (form.password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.confirm) {
      setErrorMsg("Las contraseñas no coinciden 😅");
      return;
    }

    try {
      setSubmitting(true);
      await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      // si todo va bien, el token ya está guardado
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setErrorMsg(err?.message || "Error al registrar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card shadow-lg"
        >
          <div className="text-center mb-3">
            <FaLeaf size={45} color="#00c853" />
          </div>
          <h4 className="text-center mb-2 fw-bold text-light">Crear cuenta</h4>
          <p className="text-center mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>
            Bienvenido al huerto digital 🌱
          </p>

          {errorMsg && (
            <div className="alert alert-danger py-2" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              className="form-control mb-3"
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="name"
            />

            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="form-control mb-3"
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="email"
            />

            <div className="mb-3 position-relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                className="form-control pe-5"
                value={form.password}
                onChange={handleChange}
                disabled={submitting}
                autoComplete="new-password"
              />
              <span
                onClick={() => setShowPass((v) => !v)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.8)",
                }}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="mb-4 position-relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                placeholder="Confirmar contraseña"
                className="form-control pe-5"
                value={form.confirm}
                onChange={handleChange}
                disabled={submitting}
                autoComplete="new-password"
              />
              <span
                onClick={() => setShowConfirm((v) => !v)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.8)",
                }}
                aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 fw-bold py-2"
              disabled={submitting}
              style={{
                background: "linear-gradient(90deg, #00c853, #43a047)",
                border: "none",
                opacity: submitting ? 0.8 : 1,
              }}
            >
              {submitting ? "Creando cuenta..." : "Registrarse"}
            </button>

            <Link
              to="/login"
              className="btn btn-outline-light fw-bold w-100 py-2 mt-3"
              style={{
                border: "1px solid rgba(255,255,255,0.4)",
                backdropFilter: "blur(4px)",
              }}
            >
              Volver al inicio de sesión
            </Link>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;

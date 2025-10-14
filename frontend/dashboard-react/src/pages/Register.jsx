import { useState } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Login.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden 😅");
      return;
    }
    alert(`Usuario registrado: ${form.name}`);
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
          <h4 className="text-center mb-4 fw-bold text-light">Crear cuenta</h4>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              className="form-control mb-3"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="form-control mb-3"
              value={form.email}
              onChange={handleChange}
            />

            <div className="mb-3 position-relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                className="form-control pe-5"
                value={form.password}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.8)",
                }}
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
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 fw-bold py-2"
              style={{
                background: "linear-gradient(90deg, #00c853, #43a047)",
                border: "none",
              }}
            >
              Registrarse
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

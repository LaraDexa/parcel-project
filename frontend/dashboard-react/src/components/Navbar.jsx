import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4">
      <Link to="/" className="navbar-brand fw-bold">
        AgroDevOps 🌾
      </Link>
      <div className="ms-auto">
        <Link className="btn btn-outline-light me-2" to="/">
          Dashboard
        </Link>
        <Link className="btn btn-light text-success" to="/login">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

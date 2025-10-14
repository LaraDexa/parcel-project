import LoginForm from "../components/LoginForm";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="overlay">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;

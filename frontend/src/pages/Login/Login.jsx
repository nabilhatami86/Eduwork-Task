import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, Toast } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email & Password harus diisi");
      setShowError(true);
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      setError("Email tidak valid");
      setShowError(true);
      return;
    }

    axios
      .post("http://localhost:5000/auth/login", { email, password })
      .then((result) => {
        console.log(result.data); // Debug
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.user.role);
        localStorage.setItem("name", result.data.user.full_name);
        localStorage.setItem("userId", result.data.user._id);
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/product");
        }, 2000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed");
        setShowError(true);
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#008000", height: "100vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center mb-4">LOGIN</h1>
        <label className="form-label">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control mb-3"
            placeholder="email@gmail.com"
          />
        </label>
        <label className="form-label">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control mb-3"
            placeholder="******"
          />
        </label>
        <button onClick={login} className="btn btn-success w-100 btn-lg mb-3">
          LOGIN
        </button>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-success">
            Register
          </Link>
        </p>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" className="p-3">
        {/* Success Toast */}
        <Toast
          onClose={() => setShowSuccess(false)}
          show={showSuccess}
          delay={3000}
          autohide
          className="toast-success"
        >
          <Toast.Header>
            <strong className="me-auto">🎉 Success</strong>
          </Toast.Header>
          <Toast.Body>Login berhasil! Selamat datang 🎊</Toast.Body>
        </Toast>

        {/* Error Toast */}
        <Toast
          onClose={() => setShowError(false)}
          show={showError}
          delay={3000}
          autohide
          className="toast-error"
        >
          <Toast.Header>
            <strong className="me-auto">❌ Error</strong>
          </Toast.Header>
          <Toast.Body>{error}</Toast.Body>
        </Toast>
      </ToastContainer>

      <style>
        {`
          /* Success Toast */
          .toast-success .toast-header {
            background: linear-gradient(90deg, #28a745, #1e7e34);
            color: white;
          }
          .toast-success .toast-body {
            background: #d4edda;
            border-radius: 5px;
            color: #155724;
            font-size: 1rem;
            font-weight: bold;
            text-align: center;
          }
          .toast-success {
            animation: slide-in 0.5s ease-in-out;
          }

          /* Error Toast */
          .toast-error .toast-header {
            background: linear-gradient(90deg, #dc3545, #c82333);
            color: white;
          }
          .toast-error .toast-body {
            background: #f8d7da;
            border-radius: 5px;
            color: #721c24;
            font-size: 1rem;
            font-weight: bold;
            text-align: center;
          }
          .toast-error {
            animation: shake 0.5s ease-in-out;
          }

          /* Animations */
          @keyframes slide-in {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;

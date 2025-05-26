import React from "react";
import { useState } from "react";
import { login } from "../../Api/user";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const LoginForm = () => {
  const [user, setUser] = useState({
    email: "",
    pass: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, pass } = user;
    if (!email || !pass) {
      setSnackbar({
        open: true,
        message: 'Por favor, completa todos los campos.',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await login(user);
      if (response.success) {
        localStorage.setItem("@token", response.body.data.token);
        localStorage.setItem("@role", response.body.data.role);
        navigate("/home");
      } else {
        setSnackbar({
          open: true,
          message: response.body.error || 'Error al iniciar sesión. Inténtalo de nuevo.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.log("Error al iniciar sesión:", error);
      setSnackbar({
        open: true,
        message: 'Error al iniciar sesión. Inténtalo de nuevo.',
        severity: 'error'
      });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div id="login-form">
      <h1>Iniciar Sesión</h1>
      <p>Bienvenido de nuevo</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            required
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          <label>Correo Electrónico</label>
        </div>
        <div className="form-group">
          <input
            type="password"
            required
            name="pass"
            value={user.pass}
            onChange={handleChange}
          />
          <label>Contraseña</label>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginForm;

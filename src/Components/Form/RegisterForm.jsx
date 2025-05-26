import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { register } from "../../Api/user";

const RegisterForm = () => {
  const [user, setUser] = useState({
    email: "",
    pass: "",
    name: "",
    lastName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    const { email, pass, name, lastName } = user;
    if (!email || !pass || !name || !lastName) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await register(user);
      console.log(response);
      if (response.success) {
        alert("Registro exitoso");
        // Redirigir al usuario a la página de inicio de sesión o a otra página
      } else {
        alert(response.body.error || "Error al registrarse. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.log("Error al registrar:", error);
      alert("Error al registrarse. Inténtalo de nuevo.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div id="register-form">
      <h1>Registrarse</h1>
      <p>¡Bienvenido! Crea una cuenta para comenzar.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            required
            value={user.name}
            onChange={handleChange}
          />
          <label>Nombre</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lastName"
            required
            value={user.lastName}
            onChange={handleChange}
          />
          <label>Apellido</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="email"
            required
            value={user.email}
            onChange={handleChange}
          />
          <label>Correo Electrónico</label>
        </div>
        <div className="form-group">
          <input
            type="password"
            name="pass"
            required
            value={user.pass}
            onChange={handleChange}
          />
          <label>Contraseña</label>
        </div>
        <button type="submit">Registrarse</button>
        <div id="register-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

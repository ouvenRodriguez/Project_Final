import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { createDocente } from "../../../Api/user";
import "./RegisterDocente.css";
import { useNavigate } from "react-router-dom";

const RegisterDocente = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    pass: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.pass || !formData.name || !formData.lastName) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await createDocente(formData);
      if (response.success) {
        alert("Docente registrado exitosamente");
        navigate("/list-docentes");
       
      } else {
        alert(response.message || "Error al registrar docente. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.log("Error al registrar docente:", error);
      alert("Error al registrar docente. Inténtalo de nuevo.");
    }
  };

  return (
    <Paper sx={{ 
        p: 4,
        backgroundImage: 'url("https://conceptodefinicion.de/wp-content/uploads/2016/10/Docente2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backgroundBlendMode: 'overlay'
      }}>
      <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }} align="center">
        Registro de Docente
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Apellido"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Contraseña"
          name="pass"
          type="password"
          value={formData.pass}
          onChange={handleChange}
          required
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
        >
          Registrar Docente
        </Button>
      </Box>
    </Paper>
  );
};

export default RegisterDocente;

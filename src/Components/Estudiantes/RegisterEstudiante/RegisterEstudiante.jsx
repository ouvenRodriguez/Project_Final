import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { createEstudiante } from "../../../Api/user";
import "./RegisterEstudiante.css";
import { useNavigate } from "react-router-dom";

const RegisterEstudiante = () => {
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
      const response = await createEstudiante(formData);
      if (response.success) {
        alert("Estudiante registrado exitosamente");
        navigate("/list-estudiantes");
       
      } else {
        alert(response.message || "Error al registrar estudiante. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.log("Error al registrar estudiante:", error);
      alert("Error al registrar estudiante. Inténtalo de nuevo.");
    }
  };

  return (
    <Paper sx={{ 
        p: 4,
        backgroundImage: 'url("https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backgroundBlendMode: 'overlay'
      }}>
        <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }} align="center">
          Registro de Estudiante
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
            Registrar Estudiante
          </Button>
        </Box>
      </Paper>
  );
};

export default RegisterEstudiante;

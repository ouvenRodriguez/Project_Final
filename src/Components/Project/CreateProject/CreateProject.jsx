import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import Calendar from "../../Calendar/Calendar";
import { createProject } from "../../../Api/Project";
import { getAllStudents } from "../../../Api/user";
import "./CreateProject.css";
import { useNavigate } from "react-router-dom";
const CreateProject = () => {
  const navigate = useNavigate();
  // Estado para guardar los datos del formulario
  const [formData, setFormData] = useState({
    title: "",
    area: "",
    objectives: "",
    schedule: {
      startDate: null,
      endDate: null
    },
    budget: "",
    institution: "",
    observations: "",
  });

  // Estado para la lista de estudiantes y miembros del equipo
  const [students, setStudents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");

  // Cargar estudiantes al iniciar el componente
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await getAllStudents();
        if (response.success) {
          setStudents(response.body.data);
        }
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
      }
    };
    loadStudents();
  }, []);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para manejar cambios en las fechas
  const handleDateChange = (type, date) => {
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [type]: date
      }
    });
  };

  // Función para agregar un estudiante al equipo
  const addStudentToTeam = () => {
    if (selectedStudent !== null) {
      // Agregar el estudiante seleccionado al equipo
      const newTeamMembers = [...teamMembers, students[selectedStudent]];
      setTeamMembers(newTeamMembers);
      
      // Remover el estudiante de la lista de estudiantes disponibles
      const newStudents = students.filter((_, idx) => idx !== selectedStudent);
      setStudents(newStudents);
      
      // Limpiar la selección
      setSelectedStudent(null);
    }
  };

  // Función para remover un miembro del equipo
  const removeMember = (index) => {
    // Guardar el miembro que se va a remover
    const memberToReturn = teamMembers[index];
    
    // Remover el miembro del equipo
    const newTeamMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newTeamMembers);
    
    // Devolver el miembro a la lista de estudiantes
    const newStudents = [...students, memberToReturn];
    setStudents(newStudents);
  };

  // Filtrar estudiantes según el buscador
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.title || !formData.area || !formData.objectives || 
        !formData.schedule.startDate || !formData.schedule.endDate || 
        !formData.budget || !formData.institution || teamMembers.length === 0) {
      alert("Por favor, completa todos los campos requeridos");
      return;
    }

    // Preparar los datos para enviar a la API
    const projectData = {
      ...formData,
      teamMembers: teamMembers.map(member => ({
        id: member._id,
        grade: member.grade
      }))
    };

    try {
      const response = await createProject(projectData);
      console.log(response);
      
      if (response.success) {
        alert("¡Proyecto creado exitosamente!");
        // Limpiar el formulario
        setFormData({
          title: "",
          area: "",
          objectives: "",
          schedule: {
            startDate: null,
            endDate: null
          },
          budget: "",
          institution: "",
          observations: "",
        });
        setTeamMembers([]);
        navigate("/list-projects");
      } else {
        alert("Error al crear el proyecto: " + response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear el proyecto. Por favor, intenta de nuevo.");
    }
  };

  return (
    <Container id="container">
      <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
        Formulario de Proyecto
      </Typography>

      {/* Sección de información básica */}
      <div className="row-two">
        <TextField
          label="Título del Proyecto"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <FormControl required className="form-control">
          <InputLabel id="area-label">Área</InputLabel>
          <Select
            labelId="area-label"
            name="area"
            value={formData.area}
            label="Área"
            onChange={handleChange}
          >
            <MenuItem value="Tecnología">Tecnología</MenuItem>
            <MenuItem value="Ciencias">Ciencias</MenuItem>
            <MenuItem value="Matemáticas">Matemáticas</MenuItem>
            <MenuItem value="Humanidades">Humanidades</MenuItem>
            <MenuItem value="Artes">Artes</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Sección de objetivos */}
      <div className="row-full">
        <TextField
          label="Objetivos"
          name="objectives"
          value={formData.objectives}
          onChange={handleChange}
          multiline
          rows={3}
          required
        />
      </div>

      {/* Sección de fechas, presupuesto e institución */}
      <div className="row-three">
        <Calendar
          startDate={formData.schedule.startDate}
          endDate={formData.schedule.endDate}
          onDateChange={handleDateChange}
        />

        <FormControl required className="form-control">
          <InputLabel htmlFor="budget">Presupuesto</InputLabel>
          <OutlinedInput
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Presupuesto"
            type="number"
          />
        </FormControl>

        <FormControl required className="form-control">
          <InputLabel id="institution-label">Institución</InputLabel>
          <Select
            labelId="institution-label"
            name="institution"
            value={formData.institution}
            label="Institución"
            onChange={handleChange}
          >
            <MenuItem value="Universidad Nacional">Universidad Nacional</MenuItem>
            <MenuItem value="Universidad de Antioquia">Universidad de Antioquia</MenuItem>
            <MenuItem value="Universidad de Medellín">Universidad de Medellín</MenuItem>
            <MenuItem value="Universidad EAFIT">Universidad EAFIT</MenuItem>
            <MenuItem value="Universidad Pontificia Bolivariana">Universidad Pontificia Bolivariana</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Sección de selección de equipo */}
      <div className="team-container">
        {/* Lista de estudiantes disponibles */}
        <Paper className="student-paper">
          <Typography variant="h6">Estudiantes Disponibles</Typography>
          <List className="student-list-scroll">
            {filteredStudents.map((student, idx) => (
              <React.Fragment key={student._id}>
                <ListItem
                  className={`student-list-item ${selectedStudent === idx ? "student-selected" : "student-item"}`}
                  onClick={() => setSelectedStudent(idx)}
                >
                  <ListItemAvatar>
                    <Avatar className="student-avatar">
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<span className="student-name">{`${student.name} ${student.lastName}`}</span>}
                    secondary={<span className="student-info">Email: {student.email}</span>}
                  />
                </ListItem>
                {idx < filteredStudents.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
          {/* Buscador debajo de la lista */}
          <div className="student-search-wrapper">
            <span role="img" aria-label="Buscar">🔍</span>
            <input
              type="text"
              className="student-search-input"
              placeholder="Buscar estudiante..."
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              aria-label="Buscar estudiante"
            />
          </div>
        </Paper>

        {/* Botón para agregar estudiante */}
        <div className="arrow-container">
          <IconButton
            color="primary"
            onClick={addStudentToTeam}
            disabled={selectedStudent === null}
          >
            <ArrowForwardIcon />
          </IconButton>
        </div>

        {/* Lista de miembros del equipo */}
        <Paper className="team-paper">
          <Typography variant="h6">Miembros del Equipo</Typography>
          <List className="student-list-scroll team-list">
            {teamMembers.map((member, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeMember(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar alt={member.name} src={member.avatar} className="team-avatar" />
                </ListItemAvatar>
                <ListItemText
                  primary={<span className="team-name">{`${member.name} ${member.lastName}`}</span>}
                  secondary={<span className="team-info">Email: {member.email}</span>}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>

      {/* Campo de observaciones */}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Observaciones Adicionales"
        name="observations"
        value={formData.observations}
        onChange={handleChange}
        className="observations-field"
      />

      {/* Botón de envío */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        className="submit-button"
      >
        Crear Proyecto
      </Button>
    </Container>
  );
};

export default CreateProject;

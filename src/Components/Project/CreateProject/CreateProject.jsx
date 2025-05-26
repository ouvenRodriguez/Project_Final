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

  const [students, setStudents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (type, date) => {
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [type]: date
      }
    });
  };

  const addStudentToTeam = () => {
    if (selectedStudent !== null) {
      const newTeamMembers = [...teamMembers, students[selectedStudent]];
      setTeamMembers(newTeamMembers);
      
      const newStudents = students.filter((_, idx) => idx !== selectedStudent);
      setStudents(newStudents);
      
      setSelectedStudent(null);
    }
  };

  const removeMember = (index) => {
    const memberToReturn = teamMembers[index];
    
    const newTeamMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newTeamMembers);
    
    const newStudents = [...students, memberToReturn];
    setStudents(newStudents);
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.area || !formData.objectives || 
        !formData.schedule.endDate || 
        !formData.budget || !formData.institution || teamMembers.length === 0) {
      alert("Por favor, completa todos los campos requeridos");
      return;
    }

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
            <MenuItem value="Universidad de los Andes">Universidad de los Andes</MenuItem>
            <MenuItem value="Universidad Javeriana">Universidad Javeriana</MenuItem>
            <MenuItem value="Universidad del Rosario">Universidad del Rosario</MenuItem>
            <MenuItem value="Universidad Externado">Universidad Externado</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="row-full">
        <TextField
          label="Observaciones"
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          multiline
          rows={3}
        />
      </div>

      <div className="row-full">
        <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Equipo de Trabajo
          </Typography>

          <div className="search-container">
            <TextField
              label="Buscar Estudiante"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="student-select-label">Seleccionar Estudiante</InputLabel>
              <Select
                labelId="student-select-label"
                value={selectedStudent !== null ? selectedStudent : ""}
                label="Seleccionar Estudiante"
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {filteredStudents.map((student, index) => (
                  <MenuItem key={student._id} value={index}>
                    {student.name} - {student.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={addStudentToTeam}
              disabled={selectedStudent === null}
              startIcon={<ArrowForwardIcon />}
            >
              Agregar al Equipo
            </Button>
          </div>

          <Divider sx={{ my: 2 }} />

          <List>
            {teamMembers.map((member, index) => (
              <ListItem
                key={member._id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeMember(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={member.email}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>

      <div className="row-full" style={{ marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          size="large"
        >
          Crear Proyecto
        </Button>
      </div>
    </Container>
  );
};

export default CreateProject;

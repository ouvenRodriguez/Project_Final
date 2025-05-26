import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import Calendar from "../../Calendar/Calendar";
import dayjs from "dayjs";

export default function EditModal({ open, handleClose, project, onSave }) {
  const [formData, setFormData] = React.useState({
    title: "",
    area: "",
    objectives: "",
    schedule: {
      startDate: null,
      endDate: null,
    },
    budget: "",
    institution: "",
    teamMembers: [],
    observations: "",
    status: "",
  });

  React.useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        area: project.area || "",
        objectives: project.objectives || "",
        schedule: {
          startDate: project.dateStart ? dayjs(project.dateStart) : null,
          endDate: project.dateEnd ? dayjs(project.dateEnd) : null,
        },
        budget: project.budget || "",
        institution: project.institution || "",
        teamMembers: project.team || [],
        observations: project.comments || "",
        status: project.status || "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (type, date) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [type]: date,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localStorage.getItem("@role") === "Coordinador") {
      const statusData = { status: formData.status };
      await onSave(statusData);
    } else {
      if (
        !formData.title ||
        !formData.area ||
        !formData.objectives ||
        !formData.schedule.startDate ||
        !formData.schedule.endDate ||
        !formData.budget ||
        !formData.institution
      ) {
        setSnackbar({
          open: true,
          message: "Por favor, completa todos los campos requeridos",
          severity: "error",
        });
        return;
      }

      const projectData = {
        ...formData,
        schedule: {
          startDate: formData.schedule.startDate.toISOString(),
          endDate: formData.schedule.endDate.toISOString(),
        },
      };
      await onSave(projectData);
    }
    handleClose();
  };

  const isCoordinator = localStorage.getItem("@role") === "Coordinador";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="edit-modal"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isCoordinator ? "Editar Estado del Proyecto" : "Editar Proyecto"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          {isCoordinator ? (
            <FormControl required fullWidth>
              <InputLabel id="status-label">Estado del Proyecto</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                label="Estado del Proyecto"
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="Formulación">Formulación</MenuItem>
                <MenuItem value="Evaluación">Evaluación</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
                <MenuItem value="Finalizado">Finalizado</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Título del Proyecto"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                />

                <FormControl required fullWidth>
                  <InputLabel id="area-label">Área</InputLabel>
                  <Select
                    labelId="area-label"
                    name="area"
                    value={formData.area}
                    label="Área"
                    onChange={handleChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Tecnología">Tecnología</MenuItem>
                    <MenuItem value="Ciencias">Ciencias</MenuItem>
                    <MenuItem value="Matemáticas">Matemáticas</MenuItem>
                    <MenuItem value="Humanidades">Humanidades</MenuItem>
                    <MenuItem value="Artes">Artes</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Objetivos"
                name="objectives"
                value={formData.objectives}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Calendar
                    startDate={formData.schedule.startDate}
                    endDate={formData.schedule.endDate}
                    onDateChange={handleDateChange}
                  />
                </Box>

                <FormControl required fullWidth>
                  <InputLabel htmlFor="budget">Presupuesto</InputLabel>
                  <OutlinedInput
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Presupuesto"
                    type="number"
                    sx={{ borderRadius: 2 }}
                  />
                </FormControl>

                <FormControl required fullWidth>
                  <InputLabel id="institution-label">Institución</InputLabel>
                  <Select
                    labelId="institution-label"
                    name="institution"
                    value={formData.institution}
                    label="Institución"
                    onChange={handleChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Universidad Nacional">Universidad Nacional</MenuItem>
                    <MenuItem value="Universidad de Antioquia">Universidad de Antioquia</MenuItem>
                    <MenuItem value="Universidad de Medellín">Universidad de Medellín</MenuItem>
                    <MenuItem value="Universidad EAFIT">Universidad EAFIT</MenuItem>
                    <MenuItem value="Universidad Pontificia Bolivariana">
                      Universidad Pontificia Bolivariana
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Observaciones Adicionales"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            mr: 1,
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
} 
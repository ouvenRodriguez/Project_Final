import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Calendar from '../../Calendar/Calendar';
import dayjs from 'dayjs';
import { getAllProjects, updateProject, deleteProject, updateStatus } from '../../../Api/Project';
import { createProjectAdvance, getProjectAdvances } from '../../../Api/Avance';
import './ListProject.css';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import PhotoIcon from '@mui/icons-material/Photo';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ModalConfirmarEliminacion from '../componentes/ModalConfirmarEliminacion';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      );
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}

function EditModal({ open, handleClose, project, onSave }) {
  const [formData, setFormData] = React.useState({
    title: '',
    area: '',
    objectives: '',
    schedule: {
      startDate: null,
      endDate: null
    },
    budget: '',
    institution: '',
    teamMembers: [],
    observations: '',
    status: ''
  });

  React.useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        area: project.area || '',
        objectives: project.objectives || '',
        schedule: {
          startDate: project.dateStart ? dayjs(project.dateStart) : null,
          endDate: project.dateEnd ? dayjs(project.dateEnd) : null
        },
        budget: project.budget || '',
        institution: project.institution || '',
        teamMembers: project.team || [],
        observations: project.comments || '',
        status: project.status || ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (type, date) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [type]: date
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (localStorage.getItem('@role') === 'Coordinador') {
      const statusData = { status: formData.status };
      await onSave(statusData);
    } else {
      if (!formData.title || !formData.area || !formData.objectives || 
          !formData.schedule.startDate || !formData.schedule.endDate || 
          !formData.budget || !formData.institution) {
        setSnackbar({
          open: true,
          message: 'Por favor, completa todos los campos requeridos',
          severity: 'error'
        });
        return;
      }

      const projectData = {
        ...formData,
        schedule: {
          startDate: formData.schedule.startDate.toISOString(),
          endDate: formData.schedule.endDate.toISOString()
        }
      };
      await onSave(projectData);
    }
    handleClose();
  };

  const isCoordinator = localStorage.getItem('@role') === 'Coordinador';

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      className="edit-modal"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isCoordinator ? 'Editar Estado del Proyecto' : 'Editar Proyecto'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Título del Proyecto"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 2 }
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
                multiline
                rows={3}
                required
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Calendar
                  startDate={formData.schedule.startDate}
                  endDate={formData.schedule.endDate}
                  onDateChange={handleDateChange}
                />

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
                    <MenuItem value="Universidad de los Andes">Universidad de los Andes</MenuItem>
                    <MenuItem value="Universidad Javeriana">Universidad Javeriana</MenuItem>
                    <MenuItem value="Universidad del Rosario">Universidad del Rosario</MenuItem>
                    <MenuItem value="Universidad Externado">Universidad Externado</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Observaciones"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function InfoModal({ open, handleClose, project }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Detalles del Proyecto</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Typography variant="h6">Información General</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Título"
              value={project?.title || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Área"
              value={project?.area || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Box>

          <TextField
            label="Objetivos"
            value={project?.objectives || ''}
            multiline
            rows={3}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Fecha de Inicio"
              value={project?.dateStart ? new Date(project.dateStart).toLocaleDateString() : ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Fecha de Fin"
              value={project?.dateEnd ? new Date(project.dateEnd).toLocaleDateString() : ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Presupuesto"
              value={project?.budget ? `$${project.budget}` : ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Institución"
              value={project?.institution || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Box>

          <TextField
            label="Observaciones"
            value={project?.comments || ''}
            multiline
            rows={3}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>Equipo de Trabajo</Typography>
          <List>
            {project?.team?.map((member, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={member.name}
                  secondary={member.email}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

function AdvanceModal({ open, handleClose, project, onSuccess }) {
  const [formData, setFormData] = React.useState({
    description: '',
    documents: [],
    photos: []
  });

  const handleCloseModal = () => {
    setFormData({
      description: '',
      documents: [],
      photos: []
    });
    handleClose();
  };

  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description) {
      alert('Por favor, ingresa una descripción del avance');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('description', formData.description);
      formDataToSend.append('projectId', project._id);

      formData.documents.forEach((doc, index) => {
        formDataToSend.append(`documents`, doc);
      });

      formData.photos.forEach((photo, index) => {
        formDataToSend.append(`photos`, photo);
      });

      const response = await createProjectAdvance(formDataToSend);
      
      if (response.success) {
        alert('Avance registrado exitosamente');
        onSuccess();
        handleCloseModal();
      } else {
        alert('Error al registrar el avance: ' + response.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al registrar el avance. Por favor, intenta de nuevo.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Registrar Avance</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Descripción del Avance"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            multiline
            rows={4}
            required
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Documentos</Typography>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleDocumentChange}
                style={{ display: 'none' }}
                id="document-upload"
              />
              <label htmlFor="document-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AttachFileIcon />}
                  fullWidth
                >
                  Agregar Documentos
                </Button>
              </label>
              <List>
                {formData.documents.map((doc, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => removeDocument(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <PictureAsPdfIcon />
                    </ListItemIcon>
                    <ListItemText primary={doc.name} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Fotos</Typography>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoIcon />}
                  fullWidth
                >
                  Agregar Fotos
                </Button>
              </label>
              <List>
                {formData.photos.map((photo, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => removePhoto(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <ImageIcon />
                    </ListItemIcon>
                    <ListItemText primary={photo.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Registrar Avance
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [advances, setAdvances] = React.useState([]);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const [advanceModalOpen, setAdvanceModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const loadAdvances = async () => {
    try {
      const response = await getProjectAdvances(row._id);
      if (response.success) {
        setAdvances(response.body.data);
      }
    } catch (error) {
      console.error('Error al cargar avances:', error);
    }
  };

  const formatTeamNames = (team) => {
    return team.map(member => member.name).join(', ');
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await props.onDelete(row._id);
    setDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell align="right">{row.area}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleEdit} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDeleteClick} color="error">
            <DeleteForeverIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalles del Proyecto
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Objetivos</TableCell>
                    <TableCell>Equipo</TableCell>
                    <TableCell>Presupuesto</TableCell>
                    <TableCell>Institución</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.objectives}</TableCell>
                    <TableCell>{formatTeamNames(row.team)}</TableCell>
                    <TableCell>${row.budget}</TableCell>
                    <TableCell>{row.institution}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Avances del Proyecto
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setAdvanceModalOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Registrar Avance
                </Button>
                <List>
                  {advances.map((advance, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <FolderOpenIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={advance.description}
                        secondary={new Date(advance.date).toLocaleDateString()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <EditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        project={row}
        onSave={props.onEdit}
      />

      <InfoModal
        open={infoModalOpen}
        handleClose={() => setInfoModalOpen(false)}
        project={row}
      />

      <AdvanceModal
        open={advanceModalOpen}
        handleClose={() => setAdvanceModalOpen(false)}
        project={row}
        onSuccess={loadAdvances}
      />

      <ModalConfirmarEliminacion
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar Proyecto"
        message="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
      />
    </React.Fragment>
  );
}

export default function ListProject() {
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProjects(page, searchTerm);
      if (response.success) {
        setProjects(response.body.data);
        setTotalPages(Math.ceil(response.body.total / 10));
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los proyectos',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, [page, searchTerm]);

  const handleEdit = async (projectId, formData) => {
    try {
      let response;
      if (localStorage.getItem('@role') === 'Coordinador') {
        response = await updateStatus(projectId, formData);
      } else {
        response = await updateProject(projectId, formData);
      }

      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Proyecto actualizado exitosamente',
          severity: 'success'
        });
        fetchProjects();
      } else {
        setSnackbar({
          open: true,
          message: 'Error al actualizar el proyecto: ' + response.message,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el proyecto',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await deleteProject(projectId);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Proyecto eliminado exitosamente',
          severity: 'success'
        });
        fetchProjects();
      } else {
        setSnackbar({
          open: true,
          message: 'Error al eliminar el proyecto: ' + response.message,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el proyecto',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Buscar Proyectos"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Proyecto</TableCell>
              <TableCell align="right">Área</TableCell>
              <TableCell align="right">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <Row
                key={project._id}
                row={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

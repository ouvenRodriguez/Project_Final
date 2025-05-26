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
import { getAllStudentProjects, updateProject, deleteProject, updateStatus } from '../../../Api/Project';
import { createProjectAdvance, getProjectAdvances } from '../../../Api/Avance';
import './ListProjectStudent.css';

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
                fullWidth
                multiline
                rows={3}
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
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
                    <MenuItem value="Universidad Pontificia Bolivariana">Universidad Pontificia Bolivariana</MenuItem>
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
                  sx: { borderRadius: 2 }
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
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={{
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
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
      className="info-modal"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Información Detallada del Proyecto
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div className="data-section">
            <Typography className="data-header">Información General</Typography>
            <div className="data-row">
              <Typography className="data-label">Título:</Typography>
              <Typography className="data-value">{project.title}</Typography>
            </div>
            <div className="data-row">
              <Typography className="data-label">Área:</Typography>
              <Typography className="data-value">{project.area}</Typography>
            </div>
            <div className="data-row">
              <Typography className="data-label">Institución:</Typography>
              <Typography className="data-value">{project.institution}</Typography>
            </div>
            <div className="data-row">
              <Typography className="data-label">Estado:</Typography>
              <Typography className="data-value">{project.status}</Typography>
            </div>
          </div>

          <div className="data-section">
            <Typography className="data-header">Cronograma y Presupuesto</Typography>
            <div className="data-row">
              <Typography className="data-label">Fecha de Inicio:</Typography>
              <Typography className="data-value">
                {new Date(project.dateStart).toLocaleDateString()}
              </Typography>
            </div>
            <div className="data-row">
              <Typography className="data-label">Fecha de Finalización:</Typography>
              <Typography className="data-value">
                {new Date(project.dateEnd).toLocaleDateString()}
              </Typography>
            </div>
            <div className="data-row">
              <Typography className="data-label">Presupuesto:</Typography>
              <Typography className="data-value">
                ${project.budget.toLocaleString()}
              </Typography>
            </div>
          </div>

          <div className="data-section">
            <Typography className="data-header">Objetivos</Typography>
            <div className="data-row">
              <Typography className="data-value long-text">
                {project.objectives}
              </Typography>
            </div>
          </div>

          <div className="data-section">
            <Typography className="data-header">Equipo</Typography>
            <div className="data-row">
              <div className="team-list">
                {Array.isArray(project.team) ? project.team.map((member, index) => (
                  <span key={index} className="team-member">
                    {member.name}
                  </span>
                )) : (
                  <Typography className="data-value">No hay miembros asignados</Typography>
                )}
              </div>
            </div>
          </div>

          {project.comments && (
            <div className="data-section">
              <Typography className="data-header">Observaciones</Typography>
              <div className="data-row">
                <Typography className="data-value long-text">
                  {project.comments}
                </Typography>
              </div>
            </div>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose}
          variant="contained"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AdvanceModal({ open, handleClose, project, onSuccess }) {
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState(dayjs());
  const [documents, setDocuments] = React.useState([]);
  const [photos, setPhotos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleCloseModal = () => {
    setDescription('');
    setDate(dayjs());
    setDocuments([]);
    setPhotos([]);
    setError('');
    handleClose();
  };

  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + documents.length > 5) {
      setError('Máximo 5 documentos permitidos');
      return;
    }
    setDocuments(prev => [...prev, ...files]);
    setError('');
  };

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + photos.length > 5) {
      setError('Máximo 5 fotos permitidas');
      return;
    }
    setPhotos(prev => [...prev, ...files]);
    setError('');
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !date) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const advanceData = {
        date: date.toISOString(),
        description: description,
        documents: documents,
        photos: photos
      };

      const response = await createProjectAdvance(project._id, advanceData);
      if (response.success) {
        onSuccess();
        handleCloseModal();
      } else {
        setError(response.message || 'Error al crear el avance');
      }
    } catch (error) {
      setError('Error al crear el avance');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseModal}
      className="modal-avance"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className="modal-avance-titulo">
        <AttachFileIcon sx={{ mr: 1 }} />
        Agregar Avance del Proyecto
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            label="Descripción del Avance"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              sx={{
                flex: 1,
                border: '2px dashed #1976d2',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
              component="label"
            >
              <input
                type="file"
                hidden
                multiple
                onChange={handleDocumentChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              <AttachFileIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="body1" color="textSecondary">
                {documents.length > 0 
                  ? `${documents.length} documento(s) seleccionado(s)`
                  : 'Arrastra y suelta documentos o haz clic para seleccionar'}
              </Typography>
              {documents.length > 0 && (
                <List>
                  {documents.map((doc, index) => (
                    <ListItem key={index} secondaryAction={
                      <IconButton edge="end" onClick={() => removeDocument(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }>
                      <ListItemText primary={doc.name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                border: '2px dashed #1976d2',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
              component="label"
            >
              <input
                type="file"
                hidden
                multiple
                onChange={handlePhotoChange}
                accept="image/*"
              />
              <PhotoIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="body1" color="textSecondary">
                {photos.length > 0 
                  ? `${photos.length} foto(s) seleccionada(s)`
                  : 'Arrastra y suelta fotos o haz clic para seleccionar'}
              </Typography>
              {photos.length > 0 && (
                <List>
                  {photos.map((photo, index) => (
                    <ListItem key={index} secondaryAction={
                      <IconButton edge="end" onClick={() => removePhoto(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }>
                      <ListItemText primary={photo.name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleCloseModal}
          variant="outlined"
          sx={{ 
            mr: 1,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!description || !date || loading}
          sx={{
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          {loading ? 'Guardando...' : 'Guardar Avance'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Row(props) {
  const { row, onEdit, onDelete, role } = props;
  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const [advanceModalOpen, setAdvanceModalOpen] = React.useState(false);
  const [selectedAdvance, setSelectedAdvance] = React.useState(null);

  const formatTeamNames = (team) => {
    if (!Array.isArray(team)) return '';
    return team.map(member => member.id).join(', ');
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      await onDelete(row._id);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell align="center">{row.area}</TableCell>
        <TableCell align="center">{row.institution}</TableCell>
        <TableCell align="center">{`${new Date(row.dateStart).toLocaleDateString()} - ${new Date(row.dateEnd).toLocaleDateString()}`}</TableCell>
        <TableCell align="center">{row.status}</TableCell>
        {role !== 'Estudiante' && (
          <TableCell>
            <div className="actions-container">
              <button className="edit-button" onClick={handleEdit}>
                <EditIcon className="edit-icon" />
              </button>
              <button className="delete-button" onClick={handleDelete}>
                <DeleteForeverIcon className="delete-icon" />
              </button>
            </div>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" component="div">
                Avances del Proyecto
              </Typography>

              <Box sx={{ maxHeight: 140, overflowY: 'auto', mt: 2 }}>
                <Table size="small" aria-label="project advances">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Fecha</b></TableCell>
                      <TableCell><b>Descripción</b></TableCell>
                      <TableCell align="center"><b></b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.milestones?.map((milestone, idx) => (
                      <TableRow key={milestone._id || idx}>
                        <TableCell>{new Date(milestone.date).toLocaleDateString()}</TableCell>
                        <TableCell>{milestone.description}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => setSelectedAdvance(milestone)}>
                            <FolderOpenIcon color="primary" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Dialog open={!!selectedAdvance} onClose={() => setSelectedAdvance(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Archivos del Avance</DialogTitle>
                <DialogContent>
                  {selectedAdvance && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedAdvance.documents?.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DescriptionIcon color="primary" /> Documentos:
                          </Typography>
                          <List dense>
                            {selectedAdvance.documents.map((doc, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  {doc.toLowerCase().endsWith('.pdf') ? (
                                    <PictureAsPdfIcon color="error" />
                                  ) : (
                                    <InsertDriveFileIcon color="primary" />
                                  )}
                                </ListItemIcon>
                                <ListItemText 
                                  primary={
                                    <a 
                                      href={`${API_URL}/uploads/${doc}`}
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      style={{ textDecoration: 'none', color: '#1976d2', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                      {doc}
                                    </a>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      {selectedAdvance.photos?.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ImageIcon color="primary" /> Fotos:
                          </Typography>
                          <List dense>
                            {selectedAdvance.photos.map((photo, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <ImageIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={
                                    <a 
                                      href={`${API_URL}/uploads/${photo}`}
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      style={{ textDecoration: 'none', color: '#1976d2', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                      {photo}
                                    </a>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      {(!selectedAdvance.documents?.length && !selectedAdvance.photos?.length) && (
                        <Typography color="text.secondary">No hay archivos para este avance.</Typography>
                      )}
                    </Box>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSelectedAdvance(null)} variant="contained">Cerrar</Button>
                </DialogActions>
              </Dialog>

              <Box sx={{ mt: 2 }}>
                <div className="header-info">
                  <Typography variant="subtitle1" gutterBottom>
                    Progreso del Proyecto
                  </Typography>
                  <div className="grupo-botones">
                    {role === 'Estudiante' && (
                      <button 
                        className="btn-avance"
                        onClick={() => setAdvanceModalOpen(true)}
                      >
                        <AttachFileIcon sx={{ mr: 1 }} />
                        Agregar Avance
                      </button>
                    )}
                    <button 
                      className="btn-info"
                      onClick={() => setInfoModalOpen(true)}
                    >
                      Más información
                    </button>
                  </div>
                </div>
                <LinearProgressWithLabel value={20} />
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <EditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        project={row}
        onSave={(formData) => onEdit(formData)}
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
        onSuccess={() => {
          fetchProjects();
        }}
      />
    </React.Fragment>
  );
}

export default function ListProject() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const rowsPerPage = 5;
  const role = localStorage.getItem('@role');

  const fetchProjects = async () => {
    try {
      const response = await getAllStudentProjects();
      if (response.success && response.body.data) {
        setProjects(response.body.data);
      } else {
        setProjects([]);
        setSnackbar({
          open: true,
          message: 'Error al cargar los proyectos',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
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
  }, []);

  const handleEdit = async (projectId, formData) => {
    try {
      setSnackbar({
        open: true,
        message: 'Guardando cambios...',
        severity: 'info'
      });

      let response;
      if (localStorage.getItem('@role') === 'Coordinador') {
        response = await updateStatus(projectId, formData);
      } else {
        response = await updateProject(projectId, formData);
      }

      if (response.success) {
        await fetchProjects();
        setSnackbar({
          open: true,
          message: localStorage.getItem('@role') === 'Coordinador' 
            ? 'Estado del proyecto actualizado correctamente'
            : 'Proyecto actualizado correctamente',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: localStorage.getItem('@role') === 'Coordinador'
            ? 'Error al actualizar el estado del proyecto'
            : 'Error al actualizar el proyecto',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating:', error);
      setSnackbar({
        open: true,
        message: localStorage.getItem('@role') === 'Coordinador'
          ? 'Error al actualizar el estado del proyecto'
          : 'Error al actualizar el proyecto',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (projectId) => {
    try {
      setSnackbar({
        open: true,
        message: 'Eliminando proyecto...',
        severity: 'info'
      });

      const response = await deleteProject(projectId);
      if (response.success) {
        await fetchProjects();
        setSnackbar({
          open: true,
          message: 'Proyecto eliminado correctamente',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al eliminar el proyecto',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
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

  const filteredProjects = Array.isArray(projects) ? projects.filter(project =>
    project.title?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Typography>Cargando proyectos...</Typography>
    </Box>;
  }

  return (
    <Box>
      <div className="table-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Lista de Proyectos
        </Typography>
        <div className="search-wrapper">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar proyecto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>TÍTULO</TableCell>
              <TableCell align="center">Área</TableCell>
              <TableCell align="center">Institución</TableCell>
              <TableCell align="center">Cronograma</TableCell>
              <TableCell align="center">Estado</TableCell>
              {role !== 'Estudiante' && <TableCell align="center">Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProjects.map((project) => (
              <Row 
                key={project._id} 
                row={project} 
                onEdit={(formData) => handleEdit(project._id, formData)}
                onDelete={handleDelete}
                role={role}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'right', mt: 3, mb: 2 }}>
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredProjects.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </Box>
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
    </Box>
  );
}

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './ListEstudiante.css';
import { getAllStudents, updateUser, deleteUser } from '../../../Api/user';
import ModalConfirmarEliminacionEstu from '../componentes/ModalConfirmarEliminacionEstu';

export default function ListEstudiante() {
  const [search, setSearch] = React.useState("");
  const [estudiantesList, setEstudiantesList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedEstudiante, setSelectedEstudiante] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [estudianteToDelete, setEstudianteToDelete] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  React.useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      console.log('API Response:', response);
      if (response.success) {
        setEstudiantesList(response.body.data);
      } else {
        setSnackbar({
          open: true,
          message: 'Error al cargar los estudiantes',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los estudiantes',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEstudiantes = estudiantesList.filter(estudiante =>
    estudiante.name?.toLowerCase().includes(search.toLowerCase()) ||
    estudiante.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setFormData({
      name: estudiante.name || '',
      lastName: estudiante.lastName || '',
      email: estudiante.email || '',
      password: ''
    });
    setOpenModal(true);
  };

  const handleDelete = (estudiante) => {
    setEstudianteToDelete(estudiante);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSnackbar({
        open: true,
        message: 'Eliminando estudiante...',
        severity: 'info'
      });

      const response = await deleteUser(estudianteToDelete._id);
      if (response.success) {
        setEstudiantesList(prev => prev.filter(e => e._id !== estudianteToDelete._id));
        setSnackbar({
          open: true,
          message: `Estudiante ${estudianteToDelete.name} eliminado correctamente`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al eliminar el estudiante',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el estudiante',
        severity: 'error'
      });
    } finally {
      setDeleteModalOpen(false);
      setEstudianteToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEstudiante(null);
    setFormData({
      name: '',
      lastName: '',
      email: '',
      password: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSnackbar({
        open: true,
        message: 'Guardando cambios...',
        severity: 'info'
      });

      const dataToUpdate = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email
      };

      if (formData.password) {
        dataToUpdate.password = formData.password;
      }

      const response = await updateUser(selectedEstudiante._id, dataToUpdate);
      console.log(response);
      if (response.success) {
        setEstudiantesList(prev => 
          prev.map(e => 
            e._id === selectedEstudiante._id 
              ? { ...e, ...dataToUpdate }
              : e
          )
        );

        setSnackbar({
          open: true,
          message: 'Estudiante actualizado correctamente',
          severity: 'success'
        });
        handleCloseModal();
      } else {
        setSnackbar({
          open: true,
          message: 'Error al actualizar el estudiante',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el estudiante',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Lista de Estudiantes
        </Typography>

        <div className="search-wrapper">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar estudiante..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar estudiante"
          />
        </div>
      </Box>

      <div className="list-content">
        <List className="docente-list">
          {filteredEstudiantes.map((estudiante) => (
            <ListItem
              key={estudiante._id}
              secondaryAction={
                <div className="actions-container">
                  <IconButton 
                    edge="end" 
                    aria-label={`editar ${estudiante.name}`}
                    onClick={() => handleEdit(estudiante)}
                    className="edit-button"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label={`eliminar ${estudiante.name}`}
                    onClick={() => handleDelete(estudiante)}
                    className="delete-button"
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </div>
              }
            >
              <ListItemAvatar>
                <Avatar className="docente-avatar">
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography className="docente-name">
                    {`${estudiante.name} ${estudiante.lastName}`}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography className="docente-info">
                      {estudiante.email}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>

      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        className="edit-modal"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Editar Información del Estudiante
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              label="Apellido"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              label="Correo"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
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
            onClick={handleSave} 
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

      <ModalConfirmarEliminacionEstu
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEstudianteToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Estudiante?"
        description={`¿Estás seguro de que deseas eliminar al estudiante ${estudianteToDelete?.name}? Esta acción no se puede deshacer.`}
      />

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

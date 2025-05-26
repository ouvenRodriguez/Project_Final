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
import './ListDocentes.css';
import { getAllProfessors, updateUser, deleteUser } from '../../../Api/user';
import ModalConfirmarEliminacionDoce from '../componentes/ModalConfirmarEliminacionDoce';

export default function ListDocentes() {
  const [search, setSearch] = React.useState("");
  const [docentesList, setDocentesList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDocente, setSelectedDocente] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [docenteToDelete, setDocenteToDelete] = React.useState(null);
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
    fetchDocentes();
  }, []);

  const fetchDocentes = async () => {
    try {
      setLoading(true);
      const response = await getAllProfessors();
      console.log('API Response:', response);
      if (response.success) {
        setDocentesList(response.body.data);
      } else {
        setSnackbar({
          open: true,
          message: 'Error al cargar los docentes',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching docentes:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los docentes',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDocentes = docentesList.filter(docente =>
    docente.name?.toLowerCase().includes(search.toLowerCase()) ||
    docente.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (docente) => {
    setSelectedDocente(docente);
    setFormData({
      name: docente.name || '',
      lastName: docente.lastName || '',
      email: docente.email || '',
      password: ''
    });
    setOpenModal(true);
  };

  const handleDelete = (docente) => {
    setDocenteToDelete(docente);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSnackbar({
        open: true,
        message: 'Eliminando docente...',
        severity: 'info'
      });

      const response = await deleteUser(docenteToDelete._id);

      if (response.success) {
        setDocentesList(prev => prev.filter(d => d._id !== docenteToDelete._id));
        setSnackbar({
          open: true,
          message: `Docente ${docenteToDelete.name} eliminado correctamente`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al eliminar el docente',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el docente',
        severity: 'error'
      });
    } finally {
      setDeleteModalOpen(false);
      setDocenteToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDocente(null);
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
      // Mostrar mensaje de carga
      setSnackbar({
        open: true,
        message: 'Guardando cambios...',
        severity: 'info'
      });

      // Preparar los datos para enviar
      const dataToUpdate = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email
      };

      // Solo incluir password si se ha modificado
      if (formData.password) {
        dataToUpdate.password = formData.password;
      }

      // Llamar a la API para actualizar
      const response = await updateUser(selectedDocente._id, dataToUpdate);
      console.log(response);
      if (response.success) {
        // Actualizar la lista local
        setDocentesList(prev => 
          prev.map(d => 
            d._id === selectedDocente._id 
              ? { ...d, ...dataToUpdate }
              : d
          )
        );

        setSnackbar({
          open: true,
          message: 'Docente actualizado correctamente',
          severity: 'success'
        });
        handleCloseModal();
      } else {
        setSnackbar({
          open: true,
          message: 'Error al actualizar el docente',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el docente',
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
          Lista de Docentes
        </Typography>

        <div className="search-wrapper">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar docente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar docente"
          />
        </div>
      </Box>

      <div className="list-content">
        <List className="docente-list">
          {filteredDocentes.map((docente) => (
            <ListItem
              key={docente._id}
              secondaryAction={
                <div className="actions-container">
                  <IconButton
                    edge="end"
                    aria-label={`editar ${docente.name}`}
                    onClick={() => handleEdit(docente)}
                    className="edit-button"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label={`eliminar ${docente.name}`}
                    onClick={() => handleDelete(docente)}
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
                    {`${docente.name} ${docente.lastName}`}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography className="docente-info">
                      {docente.email}
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
          Editar Información del Docente
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

      <ModalConfirmarEliminacionDoce
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDocenteToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Docente?"
        description={`¿Estás seguro de que deseas eliminar al docente ${docenteToDelete?.name}? Esta acción no se puede deshacer.`}
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

import * as React from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Box,
  Typography,
  Collapse,
  Table,
  TableHead,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  EditIcon,
  DeleteForeverIcon,
  FolderOpenIcon,
  DescriptionIcon,
  ImageIcon,
  PictureAsPdfIcon,
  InsertDriveFileIcon,
  AttachFileIcon,
} from "@mui/icons-material";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import EditModal from "./EditModal";
import InfoModal from "./InfoModal";
import AdvanceModal from "./AdvanceModal";
import { getProjectAdvances } from "../../../Api/Avance";

export default function ProjectRow({ row, onEdit, onDelete, role }) {
  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const [advanceModalOpen, setAdvanceModalOpen] = React.useState(false);
  const [advances, setAdvances] = React.useState([]);
  const [loadingAdvances, setLoadingAdvances] = React.useState(false);
  const [selectedAdvance, setSelectedAdvance] = React.useState(null);

  const loadAdvances = async () => {
    setLoadingAdvances(true);
    try {
      const response = await getProjectAdvances(row._id);
      if (response.success && response.body.data) {
        setAdvances(response.body.data);
      }
    } catch (error) {
      console.error('Error loading advances:', error);
    } finally {
      setLoadingAdvances(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      loadAdvances();
    }
  }, [open]);

  const handleEdit = () => setEditModalOpen(true);
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
        <TableCell component="th" scope="row">{row.title}</TableCell>
        <TableCell align="center">{row.area}</TableCell>
        <TableCell align="center">{row.institution}</TableCell>
        <TableCell align="center">
          {`${new Date(row.dateStart).toLocaleDateString()} - ${new Date(row.dateEnd).toLocaleDateString()}`}
        </TableCell>
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
                    {advances.map((advance, idx) => (
                      <TableRow key={advance._id || idx}>
                        <TableCell>{new Date(advance.date).toLocaleDateString()}</TableCell>
                        <TableCell>{advance.description}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => setSelectedAdvance(advance)}>
                            <FolderOpenIcon color="primary" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Dialog 
                open={!!selectedAdvance} 
                onClose={() => setSelectedAdvance(null)} 
                maxWidth="sm" 
                fullWidth
              >
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
                                      href={doc} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      style={{ textDecoration: 'none', color: '#1976d2' }}
                                    >
                                      {doc.split('/').pop()}
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
                                      href={photo} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      style={{ textDecoration: 'none', color: '#1976d2' }}
                                    >
                                      {photo.split('/').pop()}
                                    </a>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Box>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSelectedAdvance(null)} variant="contained">
                    Cerrar
                  </Button>
                </DialogActions>
              </Dialog>

              <Box sx={{ mt: 2 }}>
                <div className="header-info">
                  <Typography variant="subtitle1" gutterBottom>
                    Progreso del Proyecto
                  </Typography>
                  <div className="button-group">
                    {role === 'Estudiante' && (
                      <button 
                        className="button-advance"
                        onClick={() => setAdvanceModalOpen(true)}
                      >
                        <AttachFileIcon sx={{ mr: 1 }} />
                        Agregar Avance
                      </button>
                    )}
                    <button 
                      className="button-info"
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
        onSuccess={loadAdvances}
      />
    </React.Fragment>
  );
} 
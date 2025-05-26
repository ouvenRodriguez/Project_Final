import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import {
  AttachFileIcon,
  PhotoIcon,
  DeleteIcon,
} from "@mui/icons-material";
import { createProjectAdvance } from "../../../Api/Avance";
import dayjs from "dayjs";

export default function AdvanceModal({ open, handleClose, project, onSuccess }) {
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(dayjs());
  const [documents, setDocuments] = React.useState([]);
  const [photos, setPhotos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleCloseModal = () => {
    setDescription("");
    setDate(dayjs());
    setDocuments([]);
    setPhotos([]);
    setError("");
    handleClose();
  };

  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + documents.length > 5) {
      setError("Máximo 5 documentos permitidos");
      return;
    }
    setDocuments((prev) => [...prev, ...files]);
    setError("");
  };

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + photos.length > 5) {
      setError("Máximo 5 fotos permitidas");
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
    setError("");
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !date) {
      setError("Por favor complete todos los campos requeridos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const advanceData = {
        date: date.toISOString(),
        description: description,
        documents: documents,
        photos: photos,
      };

      const response = await createProjectAdvance(project._id, advanceData);
      if (response.success) {
        onSuccess();
        handleCloseModal();
      } else {
        setError(response.message || "Error al crear el avance");
      }
    } catch (error) {
      setError("Error al crear el avance");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      className="advance-modal"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className="advance-modal-title">
        <AttachFileIcon sx={{ mr: 1 }} />
        Agregar Avance del Proyecto
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
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
              sx: { borderRadius: 2 },
            }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                flex: 1,
                border: "2px dashed #1976d2",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
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
              <AttachFileIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
              <Typography variant="body1" color="textSecondary">
                {documents.length > 0
                  ? `${documents.length} documento(s) seleccionado(s)`
                  : "Arrastra y suelta documentos o haz clic para seleccionar"}
              </Typography>
              {documents.length > 0 && (
                <List>
                  {documents.map((doc, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => removeDocument(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={doc.name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                border: "2px dashed #1976d2",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
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
              <PhotoIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
              <Typography variant="body1" color="textSecondary">
                {photos.length > 0
                  ? `${photos.length} foto(s) seleccionada(s)`
                  : "Arrastra y suelta fotos o haz clic para seleccionar"}
              </Typography>
              {photos.length > 0 && (
                <List>
                  {photos.map((photo, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removePhoto(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
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
          disabled={!description || !date || loading}
          sx={{
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          {loading ? "Guardando..." : "Guardar Avance"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 
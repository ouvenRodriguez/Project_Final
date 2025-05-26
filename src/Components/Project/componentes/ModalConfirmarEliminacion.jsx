import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function ModalConfirmarEliminacion({
  open,
  onClose,
  onConfirm,
  title = '¿Eliminar?',
  description = '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
      PaperProps={{
        sx: { borderRadius: 4, p: 2, minWidth: 350, textAlign: 'center' }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
        <WarningAmberIcon sx={{ fontSize: 60, color: '#FFA726', mb: 1 }} />
        <DialogTitle id="confirm-delete-title" sx={{ fontWeight: 'bold', color: '#d32f2f', fontSize: 22, pb: 0 }}>
          {title}
        </DialogTitle>
        <DialogContent>
          <Typography id="confirm-delete-description" sx={{ color: '#333', mt: 1, mb: 2, fontSize: 17 }}>
            {description}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 1 }}>
          <Button onClick={onClose} variant="outlined" color="primary" sx={{ borderRadius: 2, px: 3 }}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error" startIcon={<DeleteForeverIcon />} sx={{ borderRadius: 2, px: 3, color: 'white' }}>
            {confirmText}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
} 
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography } from '@mui/material';
import { Check } from 'lucide-react';

interface SuccessDialogProps {
    open: boolean;
    onClose: () => void;
    email: string;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({ open, onClose, email }) => {
    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { borderRadius: '24px', p: '16px', maxWidth: '440px' } }}>
            <DialogTitle component="div" sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Box sx={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(0, 91, 127, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#005B7F' }}>
                        <Check size={32} />
                    </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#005B7F' }}>
                    ¡Acceso Concedido!
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                <DialogContentText sx={{ color: '#6F797A', mb: 2 }}>
                    Has iniciado sesión correctamente como Usuario en el portal académico del ISSRC.
                </DialogContentText>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: '#F6FAFA',
                        border: '1px solid rgba(0, 91, 127, 0.08)',
                        textAlign: 'left',
                    }}
                >
                    <Typography sx={{ fontSize: '12px', color: '#6F797A' }}>USUARIO AUTENTICADO</Typography>
                    <Typography sx={{ fontSize: '16px', color: '#005B7F', fontWeight: 700 }}>{email}</Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button onClick={onClose} variant="contained" sx={{ px: 4, borderRadius: '16px', background: '#005B7F' }}>
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
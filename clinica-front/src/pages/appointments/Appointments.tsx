import { useEffect, useState } from 'react';
import { get, del } from '../../services/api';
import { getLoggedUserId } from '../../utils/authUtils';
import {
  Typography,
  Paper,
  Container,
  List,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import styles from './Appointments.module.css';

interface Appointment {
  id: number;
  doctor_id: number;
  user_id: number;
  date: string;
  time: string;
  status: string;
}

interface Doctor {
  id: number;
  name: string;
}

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  const fetchAppointments = async () => {
    try {
      const all = await get<Appointment[]>('/appointments/all');
      const doctors = await get<Doctor[]>('/doctors');

      const userId = getLoggedUserId();
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];
      const filtered = all.filter(
        (appt) =>
          appt.user_id === userId &&
          appt.status === 'active' &&
          appt.date >= today
      );
      setAppointments(filtered);

      const doctorMap: Record<number, string> = {};
      doctors.forEach((doc) => {
        doctorMap[doc.id] = doc.name;
      });
      setDoctorNames(doctorMap);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenConfirm = (id: number) => {
    setSelectedAppointmentId(id);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirm = () => {
    setSelectedAppointmentId(null);
    setConfirmDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAppointmentId) return;
    try {
      await del(`/appointments/${selectedAppointmentId}`);
      await fetchAppointments();
    } catch (err) {
      console.error('Erro ao desmarcar consulta:', err);
    } finally {
      handleCloseConfirm();
    }
  };

  return (
    <Container className={styles.container}>
      <Typography variant="h4" gutterBottom>Minhas Consultas</Typography>
      <List>
        {appointments.length === 0 && (
          <Typography variant="body1">Nenhuma consulta ativa.</Typography>
        )}
        {appointments.map((appt) => (
          <Paper key={appt.id} className={styles.card}>
            <div className={styles.cardContent}>
              <ListItemText
                primary={`Consulta com Dr(a). ${doctorNames[appt.doctor_id] || `#${appt.doctor_id}`}`}
                secondary={`${appt.date} às ${appt.time}`}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleOpenConfirm(appt.id)}
              >
                Desmarcar
              </Button>
            </div>
          </Paper>
        ))}

      </List>

      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar Desmarcação</DialogTitle>
        <DialogContent>
          <Typography>Deseja realmente desmarcar esta consulta?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

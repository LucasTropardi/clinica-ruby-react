import { useEffect, useState } from 'react';
import styles from './Doctors.module.css';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  MenuItem,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Doctor } from '../../models/Doctor';
import { get, post } from '../../services/api';
import type { Appointment } from '../../models/Appointment';

const weekdayMap: Record<string, string> = {
  mon: 'Segunda-feira',
  tue: 'Terça-feira',
  wed: 'Quarta-feira',
  thu: 'Quinta-feira',
  fri: 'Sexta-feira',
  sat: 'Sábado',
  sun: 'Domingo',
};

export function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fixedSlots = [
    '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
  ];

  useEffect(() => {
    get<Doctor[]>('/doctors').then(setDoctors).catch(console.error);
  }, []);

  const handleClick = (doctor: Doctor) => {
    setSelected(doctor);
  };

  const handleClose = () => {
    setSelected(null);
    setShowFormDialog(false);
    setSelectedDate('');
    setSelectedTime('');
    setIsAvailable(false);
    setError('');
  };

  const handleSchedule = () => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else setShowFormDialog(true);
  };

  const checkAvailability = async () => {
    setError('');
    setIsAvailable(false);
    if (!selected || !selectedDate || !selectedTime) return;

    // Corrige o dia da semana para "mon", "tue", etc.
    const weekday = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();

    // Corrige estrutura com flatten (caso venha como [["mon", "wed", "fri"]])
    const available = selected.available_days.flat(); // vira: ["mon", "wed", "fri"]

    if (!available.includes(weekday)) {
      setError('O médico não atende neste dia.');
      return;
    }

    try {
      const appointments = await get<Appointment[]>('/appointments/all');
      const conflict = appointments.some((a) =>
        a.doctor_id === selected.id &&
        a.date === selectedDate &&
        a.time === selectedTime &&
        a.status === 'active'
      );
      if (conflict) {
        setError('Horário já ocupado.');
      } else {
        setIsAvailable(true);
      }
    } catch (err) {
      setError('Erro ao verificar disponibilidade');
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (!selected || !selectedDate || !selectedTime || !isAvailable) return;

    const payload = {
      appointment: {
        doctor_id: selected.id,
        date: selectedDate,
        time: selectedTime,
      },
    };

    try {
      await post('/appointments', payload);
      handleClose();
      navigate('/appointments');
    } catch (err) {
      console.error('Erro ao agendar consulta:', err);
      setError('Erro ao agendar consulta');
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <Button variant="contained" color="primary" onClick={() => navigate('/appointments')}>
          Minhas Consultas
        </Button>
      </div>

      <h1>Médicos</h1>
      <div className={styles.grid}>
        {doctors.map((doctor) => (
          <Card key={doctor.id} className={styles.card} onClick={() => handleClick(doctor)}>
            <CardContent>
              <Typography variant="h6">{doctor.name}</Typography>
              <Typography color="text.secondary">{doctor.specialty}</Typography>
              <Button variant="outlined" onClick={(e) => { e.stopPropagation(); handleClick(doctor); }}>
                Ver detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onClose={handleClose}>
        <DialogTitle>{selected?.name}</DialogTitle>
        <DialogContent dividers>
          <Typography><strong>Especialidade:</strong> {selected?.specialty}</Typography>
          <Typography><strong>CRM:</strong> {selected?.crm}</Typography>
          <Typography>
            <strong>Atende:</strong>{' '}
            {selected?.available_days
              ?.flat()
              .map((day) => weekdayMap[day] || day)
              .join(', ')}
          </Typography>
          <Button variant="contained" fullWidth onClick={handleSchedule} style={{ marginTop: '1rem' }}>
            Agendar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showFormDialog} onClose={handleClose}>
        <DialogTitle>Agendar consulta com {selected?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Data"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setIsAvailable(false);
              setError('');
            }}
          />
          <TextField
            label="Horário"
            select
            fullWidth
            margin="normal"
            value={selectedTime}
            onChange={(e) => {
              setSelectedTime(e.target.value);
              setIsAvailable(false);
              setError('');
            }}
          >
            {fixedSlots.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot} - {add30Minutes(slot)}
              </MenuItem>
            ))}
          </TextField>

          <Button
            onClick={checkAvailability}
            variant="outlined"
            color="secondary"
            disabled={!selectedDate || !selectedTime}
            style={{ marginTop: '1rem' }}
          >
            Verificar disponibilidade
          </Button>

          {error && <Typography color="error">{error}</Typography>}
          {isAvailable && <Typography color="primary">Disponível para agendamento</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!isAvailable}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function add30Minutes(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const date = new Date(0, 0, 0, h, m + 30);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
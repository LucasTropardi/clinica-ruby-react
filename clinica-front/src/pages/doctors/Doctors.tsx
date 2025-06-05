import { useEffect, useState } from 'react';
import styles from './Doctors.module.css';
import { Button, Card, CardContent, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Doctor } from '../../models/Doctor';
import { get } from '../../services/api';

export function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  get<Doctor[]>('/doctors')
    .then((data) => setDoctors(data))
    .catch((err) => {
      console.error('Erro ao buscar médicos:', err);
    });
}, []);

  const handleClick = (doctor: Doctor) => {
    setSelected(doctor);
  };

  const handleClose = () => {
    setSelected(null);
  };

  const handleSchedule = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate(`/agenda/${selected?.id}`);
    }
  };

  return (
    <div className={styles.container}>
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
          <Typography><strong>Atende:</strong> {selected?.available_days?.join(', ')}</Typography>
          <Button variant="contained" color="primary" fullWidth onClick={handleSchedule} style={{ marginTop: '1rem' }}>
            Agendar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

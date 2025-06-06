import { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Container, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Checkbox, FormGroup, FormControlLabel
} from '@mui/material';
import { get, post, put, del } from '../../services/api';
import styles from './Gerencial.module.css';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  crm: string;
  available_days: string[];
}

interface Appointment {
  id: number;
  doctor_id: number;
  user_id: number;
  date: string;
  time: string;
  status: string;
}

const WEEKDAYS = [
  { key: 'mon', label: 'Segunda-feira' },
  { key: 'tue', label: 'Terça-feira' },
  { key: 'wed', label: 'Quarta-feira' },
  { key: 'thu', label: 'Quinta-feira' },
  { key: 'fri', label: 'Sexta-feira' },
];

export function Gerencial() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [days, setDays] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    specialty: '',
    crm: '',
    available_days: '',
  });

  const fetchDoctors = async () => {
    try {
      const data = await get<Doctor[]>('/doctors');
      setDoctors(data);
    } catch (err) {
      console.error('Erro ao buscar médicos:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await get<Appointment[]>('/appointments/all');
      setAppointments(data);
    } catch (err) {
      console.error('Erro ao buscar consultas:', err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const openNewDoctor = () => {
    setForm({ name: '', specialty: '', crm: '', available_days: '' });
    setDays([]);
    setEditingDoctor(null);
    setDialogOpen(true);
  };

  const openEditDoctor = (doctor: Doctor) => {
    const parsedDays: string[] =
      Array.isArray(doctor.available_days[0])
        ? doctor.available_days[0] // pega o array interno
        : doctor.available_days as string[];

    setForm({
      name: doctor.name,
      specialty: doctor.specialty,
      crm: doctor.crm,
      available_days: '',
    });

    setEditingDoctor(doctor);
    setDays(parsedDays);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir este médico?')) {
      try {
        await del(`/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        console.error('Erro ao excluir médico:', err);
      }
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      specialty: form.specialty,
      crm: form.crm,
      available_days: days,
    };

    try {
      if (editingDoctor) {
        await put(`/doctors/${editingDoctor.id}`, payload);
      } else {
        await post('/doctors', payload);
      }
      setDialogOpen(false);
      fetchDoctors();
    } catch (err) {
      console.error('Erro ao salvar médico:', err);
    }
  };

  const openConfirmDialog = (id: number) => {
    setSelectedAppointmentId(id);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedAppointmentId(null);
    setConfirmDialogOpen(false);
  };

  const handleConfirmDeleteAppointment = async () => {
    if (!selectedAppointmentId) return;
    try {
      await del(`/appointments/${selectedAppointmentId}`);
      fetchAppointments();
    } catch (err) {
      console.error('Erro ao desmarcar consulta:', err);
    } finally {
      closeConfirmDialog();
    }
  };

  return (
    <Container className={styles.container}>
      <Typography variant="h4" gutterBottom>Área Gerencial</Typography>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Typography variant="h6">Médicos</Typography>
          <Button variant="contained" onClick={openNewDoctor}>Novo Médico</Button>
        </div>

        <Paper className={styles.tableWrapper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Especialidade</TableCell>
                <TableCell>CRM</TableCell>
                <TableCell>Atende</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.specialty}</TableCell>
                  <TableCell>{doc.crm}</TableCell>
                  <TableCell>{doc.available_days.join(', ')}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => openEditDoctor(doc)}>Editar</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(doc.id)}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Typography variant="h6">Consultas</Typography>
        </div>

        <Paper className={styles.tableWrapper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Médico ID</TableCell>
                <TableCell>Usuário ID</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>{appt.id}</TableCell>
                  <TableCell>{appt.doctor_id}</TableCell>
                  <TableCell>{appt.user_id}</TableCell>
                  <TableCell>{appt.date}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell>{appt.status}</TableCell>
                  <TableCell align="right">
                    <Button size="small" color="error" onClick={() => openConfirmDialog(appt.id)}>
                      Desmarcar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </section>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{editingDoctor ? 'Editar Médico' : 'Novo Médico'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Especialidade"
            fullWidth
            margin="dense"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          />
          <TextField
            label="CRM"
            fullWidth
            margin="dense"
            value={form.crm}
            onChange={(e) => setForm({ ...form, crm: e.target.value })}
          />

          <Typography variant="subtitle1" style={{ marginTop: '1rem' }}>
            Dias de atendimento:
          </Typography>
          <FormGroup row key={editingDoctor?.id || 'new'}>
            {WEEKDAYS.map((day) => (
              <FormControlLabel
                key={day.key}
                control={
                  <Checkbox
                    checked={days.includes(day.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDays([...days, day.key]);
                      } else {
                        setDays(days.filter((d) => d !== day.key));
                      }
                    }}
                  />
                }
                label={day.label}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirmar Desmarcação</DialogTitle>
        <DialogContent>
          <Typography>Deseja realmente desmarcar esta consulta?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDeleteAppointment} variant="contained" color="error">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

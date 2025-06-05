import { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import styles from './Register.module.css';
import { validateCPF } from '../../utils/validateCPF';
import { formatPhone } from '../../utils/formatPhone';
import { formatCPF } from '../../utils/formatCPF';

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    cellphone: '',
    address: '',
    nationality: 'brasil',
    document: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isBrazilian, setIsBrazilian] = useState(true);
  const [cpfError, setCpfError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'document') setCpfError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBrazilian && !validateCPF(form.document)) {
      setCpfError('CPF inválido');
      return;
    }

    if (form.password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    const payload = {
      ...form,
      nationality: isBrazilian ? 'brasil' : form.nationality,
      login: form.email,
    };

    await register(payload);
    navigate('/login');
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <div className={styles.logo}></div>
        <Typography variant="h5" gutterBottom>Cadastro</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            name="full_name"
            label="Nome completo"
            fullWidth
            required
            margin="normal"
            value={form.full_name}
            onChange={handleChange}
          />

          <TextField
            name="email"
            label="Email"
            fullWidth
            required
            margin="normal"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            name="password"
            label="Senha"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />

          <TextField
            name="confirmPassword"
            label="Confirmar senha"
            type="password"
            fullWidth
            required
            margin="normal"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordError('');
            }}
            error={!!passwordError}
            helperText={passwordError}
          />

          <TextField
            name="cellphone"
            label="Telefone"
            fullWidth
            required
            margin="normal"
            value={form.cellphone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setForm({ ...form, cellphone: formatted });
            }}
          />

          <TextField
            name="address"
            label="Endereço"
            fullWidth
            required
            margin="normal"
            value={form.address}
            onChange={handleChange}
          />

          <Typography variant="subtitle1" style={{ marginTop: 16 }}>
            Nacionalidade
          </Typography>
          <RadioGroup
            row
            value={isBrazilian ? 'brasil' : 'outra'}
            onChange={(e) => setIsBrazilian(e.target.value === 'brasil')}
          >
            <FormControlLabel value="brasil" control={<Radio />} label="Brasileiro(a)" />
            <FormControlLabel value="outra" control={<Radio />} label="Outro" />
          </RadioGroup>

          {!isBrazilian && (
            <TextField
              name="nationality"
              label="País de origem"
              fullWidth
              required
              margin="normal"
              value={form.nationality}
              onChange={handleChange}
            />
          )}

          {isBrazilian ? (
            <TextField
              name="document"
              label="CPF"
              fullWidth
              required
              margin="normal"
              value={form.document}
              onChange={(e) => {
                const formatted = formatCPF(e.target.value);
                setForm({ ...form, document: formatted });
              }}
              error={!!cpfError}
              helperText={cpfError}
          />
          ) : (
            <TextField
              name="document"
              label="Documento"
              fullWidth
              required
              margin="normal"
              inputProps={{ maxLength: 40 }}
              value={form.document}
              onChange={handleChange}
            />
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 16 }}>
            Cadastrar
          </Button>
        </form>

        <Typography variant="body2" align="center" style={{ marginTop: 16 }}>
          Já tem conta? <a href="/login">Faça login</a>
        </Typography>
      </Paper>
    </Container>
  );
}

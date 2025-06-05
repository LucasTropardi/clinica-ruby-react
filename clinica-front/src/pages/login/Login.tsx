import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

export function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await auth.login(email, password);
    if (success) {
      navigate('/');
    } else {
      setErrorOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <div className={styles.logo}></div>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Entrar
          </Button>
        </form>

        <Dialog open={errorOpen} onClose={() => setErrorOpen(false)}>
          <DialogTitle>Erro no login</DialogTitle>
          <DialogContent>
            Verifique suas credenciais e tente novamente.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setErrorOpen(false)} autoFocus>Fechar</Button>
          </DialogActions>
        </Dialog>

        <Typography variant="body2" align="center" style={{ marginTop: 16 }}>
          Não tem conta? <a href="/register">Cadastre-se</a>
        </Typography>
      </Paper>
    </Container>
  );
}

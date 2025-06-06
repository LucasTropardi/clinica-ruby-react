import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { useState } from 'react';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogoutClick = () => {
    setConfirmOpen(true); // Abre o diálogo
  };

  const handleConfirmLogout = () => {
    logout();
    setConfirmOpen(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setConfirmOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link to="/">Home</Link>
        <Link to="/doctors">Doctors</Link>
        {isAuthenticated && isAdmin && (
          <Link to="#">Gerencial</Link>
        )}
      </div>
      <div className={styles.right}>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogoutClick} className={styles.logoutButton}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            {' | '}
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

      <Dialog open={confirmOpen} onClose={handleCancelLogout}>
        <DialogTitle>Confirmar saída</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja sair?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirmLogout} color="error" variant="contained">Sair</Button>
        </DialogActions>
      </Dialog>
    </nav>
  );
}

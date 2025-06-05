import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link to="/">Home</Link>
        <Link to="/doctors">Doctors</Link>
      </div>
      <div className={styles.right}>
        {isAuthenticated ? (
          <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            {' | '}
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div>
      <nav>
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/doctors">Doctors</Link></li>
          <li style={{ marginLeft: 'auto' }}>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}

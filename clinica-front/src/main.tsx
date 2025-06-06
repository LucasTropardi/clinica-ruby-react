import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { Home } from './pages/home/Home' 
import { Doctors } from './pages/doctors/Doctors' 
import { Login } from './pages/login/Login' 
import { Register } from './pages/register/Register' 
import { AuthProvider } from './contexts/AuthContext'
import { Appointments } from './pages/appointments/Appointments'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/appointments" element={<Appointments />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.token);

      // Decodifica o JWT e extrai o ID do usuário
      const payload = JSON.parse(atob(response.token.split('.')[1]));
      // console.log('Payload do token:', payload);
      localStorage.setItem('user_id', String(payload.user_id));

      setToken(response.token);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const isAuthenticated = !!token;

  const isAdmin = (() => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    } catch {
      return false;
    }
  })();

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

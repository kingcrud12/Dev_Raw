import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  isLoading: boolean;
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => {
        setIsAuthenticated(true);
        setRole(res.data.role);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setRole(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = (newRole: string) => {
    setIsAuthenticated(true);
    setRole(newRole);
    navigate('/');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout failed', e);
    }
    setIsAuthenticated(false);
    setRole(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

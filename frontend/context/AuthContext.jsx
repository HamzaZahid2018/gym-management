import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/services';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await authService.me();
          setUser(response.data);
        } catch (err) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      const { user, access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(user);

      return user;
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (data) => {
    try {
      setError(null);
      const response = await authService.register(data);
      const { user, access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(user);

      return user;
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

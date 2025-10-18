import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';

const AuthContext = createContext();

const TOKEN_STORAGE_KEY = 'commission-calculator-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('commission-calculator-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistSession = useCallback((payload) => {
    if (payload?.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, payload.token);
      setToken(payload.token);
    }
    if (payload?.user) {
      localStorage.setItem('commission-calculator-user', JSON.stringify(payload.user));
      setUser(payload.user);
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('commission-calculator-user');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      persistSession(response);
      return response;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed, clearing session locally', error);
    }
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      try {
        const verified = await authService.verify();
        if (verified?.user) {
          setUser(verified.user);
        }
      } catch (error) {
        console.warn('Token verification failed', error);
        clearSession();
      }
    };
    verifyToken();
  }, [token, clearSession]);

  const value = useMemo(() => ({ token, user, login, logout, loading, isAuthenticated: Boolean(token) }), [token, user, login, logout, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

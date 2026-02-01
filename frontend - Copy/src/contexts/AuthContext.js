import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const getDeviceId = () => {
    let did = localStorage.getItem('nexhire_device_id');
    if (!did) {
      did = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('nexhire_device_id', did);
    }
    return did;
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { 
        email, 
        password, 
        device_id: getDeviceId() 
      });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.access_token);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

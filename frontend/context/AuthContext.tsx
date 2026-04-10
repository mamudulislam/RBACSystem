"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Configure axios for credentials (cookies)
axios.defaults.withCredentials = true;

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to refresh token
  const refreshToken = useCallback(async () => {
    try {
      const res = await axios.post('http://localhost:3001/auth/refresh');
      const { access_token, user: userData } = res.data;
      setAccessToken(access_token);
      setUser(userData);
      
      // Update session_data cookie
      const cookieExpiry = new Date();
      cookieExpiry.setDate(cookieExpiry.getDate() + 7);
      document.cookie = `session_data=${JSON.stringify(userData)};expires=${cookieExpiry.toUTCString()};path=/;SameSite=Lax`;
      
      return access_token;
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      return null;
    }
  }, []);

  // Initialize: Check session on load
  useEffect(() => {
    const initAuth = async () => {
      await refreshToken();
      setLoading(false);
    };
    initAuth();
  }, [refreshToken]);

  // Axios interceptor to add bearer token and handle 401s
  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent && prevRequest.url !== 'http://localhost:3001/auth/refresh') {
          prevRequest.sent = true;
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(prevRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshToken]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await axios.post('http://localhost:3001/auth/login', { email, password: pass });
      const { access_token, user: userData } = res.data;
      setAccessToken(access_token);
      setUser(userData);
      
      // Set session_data cookie for middleware/proxy to read permissions
      const cookieExpiry = new Date();
      cookieExpiry.setDate(cookieExpiry.getDate() + 7);
      document.cookie = `session_data=${JSON.stringify(userData)};expires=${cookieExpiry.toUTCString()};path=/;SameSite=Lax`;
      
      router.push('/dashboard');
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3001/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    }
    setAccessToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

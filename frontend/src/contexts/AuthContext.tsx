"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API_URL from '@/utils/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; firstName: string; lastName: string; role?: string }) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<Omit<User, 'id' | 'role'>>) => Promise<void>;
  updateRole: (role: string) => Promise<void>;
  isLoading: boolean;
}

// Create the context first, before using it
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');
    
    if (token) {
      // Verify token and get user data
      fetch(`${API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (isMounted) setUser(data.user);
      })
      .catch(() => {
        if (isMounted) localStorage.removeItem('token');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Define all functions inside the component where setUser is available
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (userData: { email: string; password: string; firstName: string; lastName: string; role?: string }) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Failed to send reset email');
    }
  };

  const resetPassword = async (token: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });

    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
  };

  const updateProfile = async (userData: any) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/api/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  const updateRole = async (role: string) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
  
    const response = await fetch(`${API_URL}/api/auth/update-role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
  
    if (!response.ok) {
      throw new Error('Failed to update role');
    }
  
    // Get updated user data
    const userData = await response.json();
    
    // Refresh the token
    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      localStorage.setItem('token', refreshData.token);
      setUser(refreshData.user);
    } else {
      // Still update the user but without refreshing token
      setUser(userData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        updateRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
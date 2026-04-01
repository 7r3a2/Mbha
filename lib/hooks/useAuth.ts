'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  university?: string;
  uniqueCode?: string;
  role?: string;
  hasWizaryExamAccess: boolean;
  hasApproachAccess: boolean;
  hasQbankAccess: boolean;
  hasCoursesAccess: boolean;
  createdAt?: string;
  updatedAt?: string;
  trialActive?: boolean;
  trialEndsAt?: string;
  subscriptionActive?: boolean;
  subscriptionExpiresAt?: string;
  isGuest?: boolean;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: string;
  university?: string;
  uniqueCode: string;
}

// API functions
const loginUser = async (data: LoginData) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    
    // Handle specific locked account error
    if (response.status === 423) {
      throw new Error(error.message || 'Account Locked: Your account has been locked due to multiple device usage. Please contact the developer to unlock your account.');
    }
    
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
};

const registerUser = async (data: RegisterData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
};

const verifyToken = async (token: string) => {
  const response = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error('Token invalid');
  }

  return response.json();
};

const validateCode = async (code: string) => {
  const response = await fetch('/api/auth/validate-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Code validation failed');
  }

  return response.json();
};

// Storage functions
const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    // Check localStorage first (remember me), then sessionStorage
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }
  return null;
};

const setStoredToken = (token: string, rememberMe: boolean = false) => {
  if (typeof window !== 'undefined') {
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
      sessionStorage.removeItem('auth_token');
    } else {
      sessionStorage.setItem('auth_token', token);
      localStorage.removeItem('auth_token');
    }
    // Also set as cookie so middleware can read it for API route protection
    document.cookie = `auth_token=${token}; path=/; max-age=${rememberMe ? 604800 : ''}; SameSite=Lax`;
  }
};

const removeStoredToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    // Clear the cookie too
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
  }
};

const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    // Check localStorage first (remember me), then sessionStorage
    const user = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const setStoredUser = (user: User, rememberMe: boolean = false) => {
  if (typeof window !== 'undefined') {
    if (rememberMe) {
      localStorage.setItem('auth_user', JSON.stringify(user));
      sessionStorage.removeItem('auth_user'); // Clear session storage if using localStorage
    } else {
      sessionStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.removeItem('auth_user'); // Clear localStorage if using sessionStorage
    }
  }
};

const removeStoredUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_user');
  }
};

// React Query hooks
export const useVerifyToken = (token: string | null) => {
  return useQuery({
    queryKey: ['verifyToken', token],
    queryFn: () => token ? verifyToken(token) : null,
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useValidateCode = () => {
  return useMutation({
    mutationFn: validateCode,
  });
};

// Main auth hook
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  const queryClient = useQueryClient();

  // Sync token to cookie on mount (for users who logged in before cookie was added)
  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      const hasCookie = document.cookie.includes('auth_token=');
      if (!hasCookie) {
        document.cookie = `auth_token=${token}; path=/; SameSite=Lax`;
      }
    }
  }, [token]);

  // Verify token on mount
  const { data: tokenVerification } = useVerifyToken(token);

  useEffect(() => {
    if (token && tokenVerification?.valid) {
      setUser(tokenVerification.user);
      setStoredUser(tokenVerification.user);
    } else if (token && tokenVerification && !tokenVerification.valid) {
      logout();
    }
    setIsLoading(false);
  }, [token, tokenVerification]);

  const login = (loginData: LoginData) => {
    return loginUser(loginData).then((data) => {
      setStoredToken(data.token, loginData.rememberMe);
      setStoredUser(data.user, loginData.rememberMe);
      setToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
      return data;
    });
  };

  const register = (registerData: RegisterData) => {
    return registerUser(registerData).then((data) => {
      setStoredToken(data.token);
      setStoredUser(data.user);
      setToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
      return data;
    });
  };

  const loginAsGuest = async () => {
    const response = await fetch('/api/auth/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to create guest session');
    }

    const data = await response.json();
    setStoredToken(data.token, false);
    setStoredUser(data.user, false);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    removeStoredToken();
    removeStoredUser();
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
    isGuest: user?.role === 'guest' || user?.isGuest === true,
    login,
    register,
    loginAsGuest,
    logout,
  };
};
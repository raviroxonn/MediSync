import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';

// Define user roles
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'paramedic' | 'dispatcher';

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  permissions: string[];
  hospital?: string;
  department?: string;
  lastLogin?: string;
}

// Registration data interface
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  hospital?: string;
  department?: string;
}

// Authentication context interface
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  clearError: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
  hasPermission: () => false,
  hasRole: () => false,
  clearError: () => {},
});

// Mock API calls - replace with actual API calls
const mockApiCall = async <T,>(data: T, delay = 1000, shouldFail = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('API call failed'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Sample users for mock authentication
const sampleUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@medisync.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as UserRole,
    permissions: ['manage_users', 'manage_hospitals', 'view_all', 'edit_all'],
    hospital: 'Central Hospital',
    department: 'Administration',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'doctor',
    email: 'doctor@medisync.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'doctor' as UserRole,
    permissions: ['view_patients', 'edit_patients', 'view_emergencies'],
    hospital: 'Central Hospital',
    department: 'Emergency',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'nurse',
    email: 'nurse@medisync.com',
    firstName: 'Michael',
    lastName: 'Johnson',
    role: 'nurse' as UserRole,
    permissions: ['view_patients', 'edit_patients_partial'],
    hospital: 'Metropolitan General',
    department: 'ICU',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '4',
    username: 'dispatcher',
    email: 'dispatcher@medisync.com',
    firstName: 'Sarah',
    lastName: 'Williams',
    role: 'dispatcher' as UserRole,
    permissions: ['view_emergencies', 'manage_dispatches'],
    hospital: 'County Hospital',
    department: 'Dispatch Center',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '5',
    username: 'paramedic',
    email: 'paramedic@medisync.com',
    firstName: 'David',
    lastName: 'Brown',
    role: 'paramedic' as UserRole,
    permissions: ['view_emergencies', 'update_emergency_status'],
    hospital: 'Metropolitan General',
    department: 'Ambulance',
    lastLogin: new Date().toISOString(),
  }
];

// Get default permissions based on role
const getDefaultPermissionsForRole = (role: UserRole): string[] => {
  switch (role) {
    case 'admin':
      return ['manage_users', 'manage_hospitals', 'view_all', 'edit_all'];
    case 'doctor':
      return ['view_patients', 'edit_patients', 'view_emergencies'];
    case 'nurse':
      return ['view_patients', 'edit_patients_partial'];
    case 'paramedic':
      return ['view_emergencies', 'update_emergency_status'];
    case 'dispatcher':
      return ['view_emergencies', 'manage_dispatches'];
    default:
      return [];
  }
};

// Provider component for authentication
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Try to use navigate, but if we're not in a Router context, it'll be undefined
  let navigate: NavigateFunction | undefined;
  try {
    navigate = useNavigate();
  } catch (e) {
    // This will catch the error if we're not in a Router context
    // We'll handle navigation differently when navigate is undefined
  }

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        // Invalid stored data, clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      const matchedUser = sampleUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!matchedUser || password !== 'password') { // All sample users have password 'password'
        throw new Error('Invalid email or password');
      }
      
      // Generate a mock token
      const mockToken = `token_${matchedUser.id}_${Date.now()}`;
      
      // Update user's last login
      const updatedUser = {
        ...matchedUser,
        lastLogin: new Date().toISOString()
      };
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('token', mockToken);
      
      // Update state
      setUser(updatedUser);
      setToken(mockToken);
      
      // Navigate to dashboard if navigate is available
      if (navigate) {
        navigate('/dashboard');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    
    // Navigate to login page
    if (navigate) {
      navigate('/auth/login');
    } else {
      window.location.href = '/auth/login';
    }
  }, [navigate]);

  // Register function
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if email already exists
      if (sampleUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error('Email already in use');
      }
      
      // Mock new user creation
      const newUser = {
        id: `${sampleUsers.length + 1}`,
        username: userData.email.split('@')[0],
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        permissions: getDefaultPermissionsForRole(userData.role),
        hospital: userData.hospital || 'Not assigned',
        department: userData.department || 'Not assigned',
        lastLogin: new Date().toISOString(),
      };
      
      // Simulate API call
      await mockApiCall(newUser);
      
      // In a real app, you would redirect to login
      // For this mock, we'll auto-login the user
      const mockToken = `token_${newUser.id}_${Date.now()}`;
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', mockToken);
      
      setUser(newUser);
      setToken(mockToken);
      
      if (navigate) {
        navigate('/dashboard');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if email exists
      const userExists = sampleUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!userExists) {
        throw new Error('No account found with this email');
      }
      
      // In a real app, this would send a reset email
      await mockApiCall({ success: true });
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would validate the token and update the password
      // Include token and newPassword in the API call to address TypeScript warnings
      await mockApiCall({ 
        success: true, 
        tokenUsed: token, 
        passwordUpdated: newPassword.length > 0 
      });
      
      // Navigate to login
      if (navigate) {
        navigate('/auth/login');
      } else {
        window.location.href = '/auth/login';
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('You must be logged in to update your profile');
      }
      
      // Update user data
      const updatedUser = {
        ...user,
        ...userData,
      };
      
      // Mock API call
      await mockApiCall(updatedUser);
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  // Check if user has a specific role
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      error,
      login,
      logout,
      register,
      forgotPassword,
      resetPassword,
      updateUserProfile,
      hasPermission,
      hasRole,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth, AuthContext }; 
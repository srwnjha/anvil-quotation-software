import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserRole, AuthState } from '@/types';
import { db } from '@/lib/db';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  canAccess: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission matrix
const permissions: Record<UserRole, Record<string, string[]>> = {
  super_admin: {
    users: ['create', 'read', 'update', 'delete'],
    company: ['read', 'update'],
    customers: ['create', 'read', 'update', 'delete'],
    products: ['create', 'read', 'update', 'delete'],
    quotations: ['create', 'read', 'update', 'delete', 'approve', 'send'],
    reports: ['read'],
    settings: ['read', 'update'],
  },
  admin: {
    users: ['create', 'read', 'update'],
    company: ['read'],
    customers: ['create', 'read', 'update', 'delete'],
    products: ['create', 'read', 'update', 'delete'],
    quotations: ['create', 'read', 'update', 'delete', 'approve', 'send'],
    reports: ['read'],
    settings: ['read'],
  },
  manager: {
    users: ['read'],
    company: ['read'],
    customers: ['create', 'read', 'update'],
    products: ['read'],
    quotations: ['create', 'read', 'update', 'approve', 'send'],
    reports: ['read'],
    settings: [],
  },
  sales_user: {
    users: [],
    company: ['read'],
    customers: ['create', 'read', 'update'],
    products: ['read'],
    quotations: ['create', 'read', 'update', 'send'],
    reports: ['read'],
    settings: [],
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock authentication - any password works for demo
    const user = db.getUserByEmail(email);
    
    if (user && user.isActive) {
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const hasRole = useCallback((roles: UserRole[]): boolean => {
    if (!state.user) return false;
    return roles.includes(state.user.role);
  }, [state.user]);

  const canAccess = useCallback((module: string, action: string): boolean => {
    if (!state.user) return false;
    const userPermissions = permissions[state.user.role];
    if (!userPermissions) return false;
    const modulePermissions = userPermissions[module] || [];
    return modulePermissions.includes(action);
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        hasRole,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

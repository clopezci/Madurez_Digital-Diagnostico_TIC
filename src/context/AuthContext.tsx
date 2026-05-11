'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Usuario } from '@/types';
import { getSesion, cerrarSesion } from '@/lib/storage';

interface AuthContextValue {
  usuario: Usuario | null;
  loading: boolean;
  recargar: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  usuario: null,
  loading: true,
  recargar: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const recargar = () => {
    setUsuario(getSesion());
    setLoading(false);
  };

  useEffect(() => {
    recargar();
  }, []);

  const logout = () => {
    cerrarSesion();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, recargar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

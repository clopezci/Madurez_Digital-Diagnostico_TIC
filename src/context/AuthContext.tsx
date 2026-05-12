'use client';
import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from 'react';
import type { Usuario } from '@/types';
import { supabase, isSupabaseEnabled } from '@/lib/supabase';
import { getSesionLocal, cerrarSesion } from '@/lib/storage';

interface AuthContextValue {
  usuario: Usuario | null;
  loading: boolean;
  recargar: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  usuario: null,
  loading: true,
  recargar: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseEnabled && supabase) {
      // Escucha cambios de sesión en tiempo real (login, logout, refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUsuario({
              id:         session.user.id,
              email:      session.user.email ?? '',
              nombre:     session.user.user_metadata?.nombre
                            ?? session.user.email?.split('@')[0]
                            ?? '',
              createdAt:  session.user.created_at,
            });
          } else {
            setUsuario(null);
          }
          setLoading(false);
        },
      );
      return () => subscription.unsubscribe();
    }

    // ── fallback localStorage ──
    setUsuario(getSesionLocal());
    setLoading(false);
  }, []);

  const recargar = () => {
    if (!isSupabaseEnabled) {
      setUsuario(getSesionLocal());
    }
    // Con Supabase, onAuthStateChange lo maneja automáticamente
  };

  const logout = async () => {
    await cerrarSesion();
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

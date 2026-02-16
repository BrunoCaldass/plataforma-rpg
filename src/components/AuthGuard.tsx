import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const AuthGuard = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica a sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Fica ouvindo mudanças (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-900 text-amber-500">Carregando Grimório...</div>;
  }

  // Se tem sessão, mostra o conteúdo (Outlet). Se não, chuta pro Login.
  return session ? <Outlet /> : <Navigate to="/login" replace />;
};
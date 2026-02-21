// ============================================================
// components/AuthGuard.tsx — Route Guard com RBAC
// ============================================================
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/auth";

interface AuthGuardProps {
  /** Se definido, exige que o usuário tenha este papel para acessar */
  requiredRole?: UserRole;
}

/**
 * Componente wrapper para rotas protegidas.
 * - Sem `requiredRole`: exige apenas autenticação.
 * - Com `requiredRole`: exige autenticação + papel específico.
 */
export function AuthGuard({ requiredRole }: AuthGuardProps) {
  const { state } = useAuth();

  // Estado de carregamento
  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="relative">
          {/* Anel animado */}
          <div className="w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-gold-glow animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        </div>
        <p className="mt-6 font-display text-lg gold-text tracking-widest animate-pulse">
          Abrindo Grimório…
        </p>
      </div>
    );
  }

  // Não autenticado → Login
  if (!state.isAuthenticated || !state.user) {
    return <Navigate to="/login" replace />;
  }

  // Papel insuficiente → Dashboard padrão
  if (requiredRole && state.user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
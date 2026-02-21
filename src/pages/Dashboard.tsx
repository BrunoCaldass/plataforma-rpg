// ============================================================
// pages/Dashboard.tsx — Router de Dashboard baseado em Role
// ============================================================
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

/**
 * Página de redirecionamento inteligente:
 * - Mestre  → /master-dashboard
 * - Jogador → / (ficha do jogador)
 */
const Dashboard = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin" />
        <p className="mt-6 font-display text-lg gold-text tracking-widest animate-pulse">
          Carregando…
        </p>
      </div>
    );
  }

  if (!state.isAuthenticated || !state.user) {
    return <Navigate to="/login" replace />;
  }

  // RBAC routing
  if (state.user.role === "master") {
    return <Navigate to="/master-dashboard" replace />;
  }

  // Jogador → sua própria ficha
  return <Navigate to="/my-sheet" replace />;
};

export default Dashboard;
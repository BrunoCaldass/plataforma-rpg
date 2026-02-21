import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PlayerSheet from "./pages/PlayerSheet";
import MasterDashboard from "./pages/MasterDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota PÚBLICA */}
            <Route path="/login" element={<Login />} />

            {/* Rotas PRIVADAS (exige autenticação) */}
            <Route element={<AuthGuard />}>
              {/* Dashboard inteligente — redireciona com base no role */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Ficha do jogador */}
              <Route path="/my-sheet" element={<PlayerSheet />} />

              {/* Rota legada — redireciona para /my-sheet */}
              <Route path="/" element={<Navigate to="/my-sheet" replace />} />

              {/* Painel do Mestre */}
              <Route path="/master-dashboard" element={<MasterDashboard />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
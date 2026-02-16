import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/AuthGuard"; // <--- Importamos o Guarda

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rota PÚBLICA (Qualquer um acessa) */}
          <Route path="/login" element={<Login />} />

          {/* Rotas PRIVADAS (Só com login acessa) */}
          <Route element={<AuthGuard />}>
            <Route path="/" element={<Index />} />       {/* Ficha */}
            <Route path="/dashboard" element={<Dashboard />} /> {/* Painel */}
          </Route>

          {/* Rota de Erro */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
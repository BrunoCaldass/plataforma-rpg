import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verifica se tem alguém logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login"); // Se não tiver logado, manda pro login
      } else {
        setUser(session.user);
        // Verifica se é o ADMIN (seu email)
        if (session.user.email === "brunocaldass@hotmail.com" || session.user.email === "Brunocaldass@hotmail.com") {
          setIsAdmin(true);
        }
      }
    });

    // Escuta mudanças no login (se deslogar, por exemplo)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!user) return <div className="p-8 text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-500">Painel de Controle</h1>
            <p className="text-gray-400">Bem-vindo, {user.email}</p>
            {isAdmin && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mt-2 inline-block">
                MODO ADMINISTRADOR
              </span>
            )}
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-500 hover:bg-red-950">
            Sair
          </Button>
        </div>

        {/* ÁREA DO CONTEÚDO */}
        <div className="grid gap-6">
          {isAdmin ? (
            <div className="bg-slate-800 p-6 rounded-lg border border-red-900/50">
              <h2 className="text-xl font-semibold mb-4 text-red-400">Gerenciamento de Jogadores (Mestre)</h2>
              <p className="text-gray-400">Aqui aparecerão todas as fichas dos jogadores para edição.</p>
              {/* Aqui vamos listar as fichas depois */}
            </div>
          ) : (
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-amber-400">Minha Ficha</h2>
              <p className="text-gray-400">Você ainda não tem uma ficha vinculada.</p>
              <Button className="mt-4 bg-amber-600 hover:bg-amber-700">Criar Ficha</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
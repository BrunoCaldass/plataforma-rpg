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
        // Verifica se é o ADMIN (seu email cadastrado)
        if (session.user.email?.toLowerCase() === "brunocaldass@hotmail.com") {
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

  if (!user) return <div className="p-8 text-white bg-slate-900 min-h-screen">Carregando Grimório...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-500 uppercase tracking-tighter">Elite Ametista</h1>
            <p className="text-gray-400">Bem-vindo, {user.email}</p>
            {isAdmin && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mt-2 inline-block uppercase">
                Modo Mestre (ADM)
              </span>
            )}
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-500 hover:bg-red-950 hover:text-red-400">
            Encerrar Sessão
          </Button>
        </div>

        {/* ÁREA DO CONTEÚDO */}
        <div className="grid gap-6">
          {isAdmin ? (
            <div className="bg-slate-800 p-6 rounded-lg border border-red-900/30 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-red-400">Painel do Mestre</h2>
                <Button 
                  onClick={() => navigate("/")} 
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Visualizar Minha Ficha
                </Button>
              </div>
              
              <div className="border-t border-slate-700 pt-6">
                <p className="text-gray-400 mb-4">Gerenciamento de Jogadores:</p>
                {/* Espaço reservado para a lista de jogadores do banco de dados */}
                <div className="bg-slate-900/50 p-8 rounded border border-dashed border-slate-700 text-center">
                  <p className="text-slate-500 italic">Aguardando novos jogadores se registrarem...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-amber-400">Área do Jogador</h2>
              <p className="text-gray-400">Você está conectado ao sistema Elite Ametista.</p>
              
              <div className="mt-8 p-6 bg-slate-900/50 rounded border border-slate-700">
                <h3 className="text-lg font-medium text-slate-300 mb-2">Sua Ficha de Personagem</h3>
                <p className="text-sm text-slate-500 mb-4">Ainda não há uma ficha vinculada a este e-mail.</p>
                <Button onClick={() => navigate("/")} className="bg-amber-600 hover:bg-amber-700">
                  Ver Template da Ficha
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
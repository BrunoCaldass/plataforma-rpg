import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Usando o sistema de notificação que já tem no projeto
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tenta enviar um Magic Link (login sem senha, só por email)
      // É mais fácil de configurar agora no início
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) throw error;

      toast.success("Link de login enviado para seu email!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-md space-y-8 bg-slate-800 p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-500">Elite Ametista</h2>
          <p className="mt-2 text-gray-400">Entre para acessar sua ficha</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Entrar com Email Mágico"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
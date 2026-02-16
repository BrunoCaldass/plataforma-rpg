import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Controla se é Login ou Registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Novo campo de senha
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        // --- PROCESSO DE REGISTRO ---
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) throw error;

        if (data.user) {
          toast.success("Cadastro realizado! Verifique seu e-mail para confirmar.");
          setIsRegistering(false); // Volta para a tela de login
        }
      } else {
        // --- PROCESSO DE LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          // Erro específico caso o e-mail não tenha sido confirmado no SMTP
          if (error.message.includes("Email not confirmed")) {
            toast.error("Por favor, confirme seu e-mail antes de logar.");
          } else {
            throw error;
          }
        } else if (data.user) {
          toast.success("Login realizado com sucesso!");
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-md space-y-8 bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-500 uppercase tracking-tighter">Elite Ametista</h2>
          <p className="mt-2 text-gray-400">
            {isRegistering ? "Crie sua conta de jogador" : "Entre para acessar sua ficha"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">E-mail</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white focus:border-amber-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Senha</label>
            <Input
              type="password"
              placeholder="Sua senha secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white focus:border-amber-500"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-700 font-bold"
            disabled={loading}
          >
            {loading ? "Processando..." : isRegistering ? "Criar Conta de Jogador" : "Entrar no RPG"}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-amber-500 hover:text-amber-400 text-sm underline underline-offset-4"
          >
            {isRegistering ? "Já tem conta? Faça Login" : "Não tem conta? Registre-se aqui"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
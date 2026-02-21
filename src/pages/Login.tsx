// ============================================================
// pages/Login.tsx — Página de Autenticação (Login + Registro)
// ============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Shield,
  Swords,
  Mail,
  Lock,
  User,
  Sparkles,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, state } = useAuth();

  // ── State ────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // ── Handlers ─────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      toast.success("Bem-vindo de volta, aventureiro!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha na autenticação";
      if (message.includes("Email not confirmed")) {
        toast.error("Confirme seu e-mail antes de entrar.");
      } else if (message.includes("Invalid login credentials")) {
        toast.error("E-mail ou senha incorretos.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName || !regEmail || !regPassword || !regConfirm) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (regPassword !== regConfirm) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await register({ email: regEmail, password: regPassword, displayName: regName });

      if (state.isAuthenticated) {
        toast.success("Conta criada! Entrando…");
        navigate("/dashboard");
      } else {
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
        setActiveTab("login");
        setRegName("");
        setRegEmail("");
        setRegPassword("");
        setRegConfirm("");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha no registro";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden p-4">
      {/* ── Background decorations ─────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-3xl" />
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/[0.06] to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-arcane/[0.04] to-transparent rounded-tl-full" />
        {/* Floating particles */}
        <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-gold-glow rounded-full animate-glow-pulse" />
        <div className="absolute top-[60%] right-[20%] w-1.5 h-1.5 bg-gold-glow rounded-full animate-glow-pulse [animation-delay:1s]" />
        <div className="absolute bottom-[30%] left-[40%] w-1 h-1 bg-arcane rounded-full animate-glow-pulse [animation-delay:2s]" />
        <div className="absolute top-[40%] right-[35%] w-0.5 h-0.5 bg-gold rounded-full animate-glow-pulse [animation-delay:0.5s]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--gold-dim)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--gold-dim)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Main Card ──────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-card border-2 border-gold-dim mb-4 shadow-[0_0_30px_-5px_hsl(var(--gold)/0.2)]">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold gold-text tracking-widest uppercase">
            Chronicle Keeper
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-body">
            Gerencie suas aventuras com maestria
          </p>
          <div className="mt-3 mx-auto w-48 section-divider" />
        </div>

        {/* Tabs Card */}
        <Card className="card-rpg border-gold-dim/30 shadow-[0_0_40px_-10px_hsl(var(--gold)/0.1)]">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "login" | "register")}
          >
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-12">
                <TabsTrigger
                  value="login"
                  className="font-display text-sm tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_12px_-3px_hsl(var(--gold)/0.4)] transition-all duration-300"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="font-display text-sm tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_12px_-3px_hsl(var(--gold)/0.4)] transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrar-se
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* ── LOGIN TAB ──────────────────────────────── */}
              <TabsContent value="login" className="mt-0">
                <CardTitle className="text-xl font-display gold-text mb-1 flex items-center gap-2">
                  <Swords className="w-5 h-5" />
                  Acessar o Grimório
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-6">
                  Entre com suas credenciais para continuar sua jornada.
                </CardDescription>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      E-mail
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="aventureiro@rpg.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="input-rpg h-11"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Sua senha secreta"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="input-rpg h-11 pr-10"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold tracking-wider text-sm uppercase shadow-[0_0_15px_-3px_hsl(var(--gold)/0.3)] hover:shadow-[0_0_20px_-3px_hsl(var(--gold)/0.5)] transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Invocando…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Entrar no RPG
                      </span>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* ── REGISTER TAB ───────────────────────────── */}
              <TabsContent value="register" className="mt-0">
                <CardTitle className="text-xl font-display gold-text mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Criar Personagem
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-6">
                  Registre-se para iniciar sua aventura.
                </CardDescription>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Nome de Aventureiro
                    </Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Tharion, o Destemido"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="input-rpg h-11"
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      E-mail
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="aventureiro@rpg.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="input-rpg h-11"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showRegPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="input-rpg h-11 pr-10"
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      Confirmar Senha
                    </Label>
                    <Input
                      id="reg-confirm"
                      type="password"
                      placeholder="Repita a senha"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      className="input-rpg h-11"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold tracking-wider text-sm uppercase shadow-[0_0_15px_-3px_hsl(var(--gold)/0.3)] hover:shadow-[0_0_20px_-3px_hsl(var(--gold)/0.5)] transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Criando…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Criar Conta de Jogador
                      </span>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs mt-6 font-body">
          © 2026 Chronicle Keeper — Forjado para mestres e aventureiros.
        </p>
      </div>
    </div>
  );
};

export default Login;
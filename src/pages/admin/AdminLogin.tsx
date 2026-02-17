import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, AlertCircle, Lock } from "lucide-react";
import logoImg from "@/assets/logo-unique-navy-cropped.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError("Credenciais inválidas. Tente novamente.");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-sm">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <img src={logoImg} alt="Grupo Unique" className="h-10 mx-auto brightness-0 invert mb-6" />
          <div className="inline-flex items-center gap-2 text-primary-foreground/40 text-xs font-medium uppercase tracking-widest">
            <Lock size={12} />
            <span>Área restrita</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl p-7 shadow-2xl border border-border/50">
          <h1 className="text-lg font-bold text-foreground mb-1">Entrar</h1>
          <p className="text-xs text-muted-foreground mb-6">Acesse o painel administrativo</p>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-xs rounded-lg p-3 mb-4">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@grupounique.com"
                className="mt-1.5 h-10 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1.5 h-10 text-sm"
              />
            </div>
            <Button type="submit" className="w-full h-10 hero-gradient border-0 text-primary-foreground text-sm font-medium" disabled={loading}>
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>

        <p className="text-center text-[11px] text-primary-foreground/25 mt-6">
          Clínica Unique · Painel Administrativo
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  BookOpen,
  Users,
  Shield,
} from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const success = login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("E-posta veya sifre hatali. Lutfen tekrar deneyin.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full border-2 border-white/20" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-white/20" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-white text-lg">Ankara Medipol</h2>
              <p className="text-white/70 text-sm">Universitesi</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-white text-4xl leading-tight">
            Yabanci Diller
            <br />
            Yuksekokulu
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Hazirlik Sinifi Odev Paylasim Platformu
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-white/80">
              <BookOpen className="w-5 h-5" />
              <span>Odevlerinizi kolayca takip edin</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Users className="w-5 h-5" />
              <span>Duyurulardan aninda haberdar olun</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Shield className="w-5 h-5" />
              <span>Akademik takvimi inceleyin</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-sm">
            2025-2026 Akademik Yili
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-primary">Ankara Medipol Universitesi</h2>
            <p className="text-muted-foreground text-sm">
              Hazirlik Sinifi Odev Paylasim Platformu
            </p>
          </div>

          <div>
            <h1 className="text-foreground mb-1">Admin Girisi</h1>
            <p className="text-muted-foreground">
              Odev ve duyuru yonetimi icin admin hesabinizla giris yapin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-foreground">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-foreground">
                Sifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sifrenizi girin"
                  className="w-full pl-11 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Giris Yap"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-2">
              Demo Hesap:
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-xs">
                  Admin
                </span>
                <span className="text-muted-foreground">
                  admin@gmail.com / admin123
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
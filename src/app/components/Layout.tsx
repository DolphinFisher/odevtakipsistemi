import { Outlet, NavLink, useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  GraduationCap,
  Home,
  Megaphone,
  BookOpen,
  CalendarDays,
  LogOut,
  LogIn,
  Menu,
  X,
  Shield,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";

export function Layout() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/", label: "Ana Sayfa", icon: Home },
    { to: "/duyurular", label: "Duyurular", icon: Megaphone },
    { to: "/odevler", label: "Odevler", icon: BookOpen },
    { to: "/akademik-takvim", label: "Akademik Takvim", icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-primary text-sm leading-tight">
                  Ankara Medipol
                </h3>
                <p className="text-muted-foreground text-xs">
                  Hazirlik Sinifi
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
            </NavLink>
          ))}
        </nav>

        {/* Admin Section */}
        <div className="p-4 border-t border-border">
          {isAuthenticated && isAdmin ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Yonetici</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cikis Yap
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Admin Girisi
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {isAuthenticated && isAdmin ? (
              <>
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-foreground">{user?.name}</span>
                <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-xs">
                  Admin
                </span>
              </>
            ) : (
              <span className="hidden sm:inline">YDYO Hazirlik Sinifi Platformu</span>
            )}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors text-foreground"
              title={theme === "light" ? "Karanlik Tema" : "Aydinlik Tema"}
            >
              {theme === "light" ? (
                <Moon className="w-[18px] h-[18px]" />
              ) : (
                <Sun className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

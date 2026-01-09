import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, Search, FileText, MessageCircle, GraduationCap, 
  User, Settings, LogOut, Users, Briefcase, BarChart3, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

type AppRole = "candidat" | "assistant" | "recruteur" | "admin";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const candidatNav: NavItem[] = [
  { icon: Home, label: "Accueil", href: "/app" },
  { icon: Search, label: "Offres", href: "/app/offres" },
  { icon: FileText, label: "Mes Candidatures", href: "/app/candidatures" },
  { icon: MessageCircle, label: "Messages", href: "/app/messages" },
  { icon: GraduationCap, label: "Training Hub", href: "/app/training" },
  { icon: User, label: "Mon Profil", href: "/app/profil" },
  { icon: Settings, label: "Paramètres", href: "/app/settings" },
];

const assistantNav: NavItem[] = [
  { icon: Home, label: "Tableau de bord", href: "/app/assistant" },
  { icon: Users, label: "Mes Candidats", href: "/app/assistant/candidats" },
  { icon: FileText, label: "Candidatures", href: "/app/assistant/candidatures" },
  { icon: MessageCircle, label: "Messages", href: "/app/assistant/messages" },
  { icon: Settings, label: "Paramètres", href: "/app/assistant/settings" },
];

const recruteurNav: NavItem[] = [
  { icon: Home, label: "Tableau de bord", href: "/app/recruteur" },
  { icon: Briefcase, label: "Mes Offres", href: "/app/recruteur/offres" },
  { icon: Users, label: "Candidatures reçues", href: "/app/recruteur/candidatures" },
  { icon: Search, label: "CVthèque", href: "/app/recruteur/cvtheque" },
  { icon: MessageCircle, label: "Messages", href: "/app/recruteur/messages" },
  { icon: Settings, label: "Paramètres", href: "/app/recruteur/settings" },
];

const adminNav: NavItem[] = [
  { icon: Home, label: "Vue d'ensemble", href: "/app/admin" },
  { icon: Users, label: "Utilisateurs", href: "/app/admin/users" },
  { icon: Briefcase, label: "Offres", href: "/app/admin/offres" },
  { icon: BarChart3, label: "Analytics", href: "/app/admin/analytics" },
  { icon: Shield, label: "Logs", href: "/app/admin/logs" },
  { icon: Settings, label: "Paramètres", href: "/app/admin/settings" },
];

const navByRole: Record<AppRole, NavItem[]> = {
  candidat: candidatNav,
  assistant: assistantNav,
  recruteur: recruteurNav,
  admin: adminNav,
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const navItems = navByRole[role || "candidat"];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-navy text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="text-2xl font-bold">
          Candid'<span className="text-gold">aide</span>
        </Link>
        {role && (
          <p className="text-xs text-white/50 mt-1 capitalize">
            Mode {role}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-gold text-navy font-medium" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <User className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.user_metadata?.prenom || user?.email?.split("@")[0]}
            </p>
            <p className="text-xs text-white/50 truncate">{user?.email}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type AppRole = "candidat" | "assistant" | "recruteur" | "admin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, requireAuth = true }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  // Si l'auth n'est pas requise, on laisse passer
  if (!requireAuth) {
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect based on actual role
    const roleRoutes: Record<AppRole, string> = {
      candidat: "/app",
      assistant: "/app/assistant",
      recruteur: "/app/recruteur",
      admin: "/app/admin"
    };
    return <Navigate to={roleRoutes[role] || "/app"} replace />;
  }

  return <>{children}</>;
}

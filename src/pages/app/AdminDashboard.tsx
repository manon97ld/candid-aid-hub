import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Users, Briefcase, FileText, TrendingUp, DollarSign, Activity } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const prenom = user?.user_metadata?.prenom || "Admin";

  const stats = {
    totalUsers: 156,
    candidats: 120,
    assistants: 8,
    recruteurs: 28,
    offresActives: 45,
    candidatures: 380,
    revenue: "2,450€"
  };

  const recentUsers = [
    { id: 1, email: "marie@example.com", role: "candidat", date: "Il y a 1h" },
    { id: 2, email: "jean@company.com", role: "recruteur", date: "Il y a 3h" },
    { id: 3, email: "sophie@example.com", role: "candidat", date: "Il y a 5h" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="bg-gradient-to-r from-navy to-navy-light text-white p-6">
        <h1 className="text-2xl font-bold mb-1">Administration Candid'aide</h1>
        <p className="text-white/70">
          Vue d'ensemble de la plateforme
        </p>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.totalUsers}</p>
              <p className="text-sm text-gray-500">Utilisateurs</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.offresActives}</p>
              <p className="text-sm text-gray-500">Offres actives</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.candidatures}</p>
              <p className="text-sm text-gray-500">Candidatures</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.revenue}</p>
              <p className="text-sm text-gray-500">Revenus/mois</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users breakdown */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy mb-4">Répartition des utilisateurs</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Candidats</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "77%" }} />
                </div>
                <span className="text-sm font-medium">{stats.candidats}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Recruteurs</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "18%" }} />
                </div>
                <span className="text-sm font-medium">{stats.recruteurs}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Assistants</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "5%" }} />
                </div>
                <span className="text-sm font-medium">{stats.assistants}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent users */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy mb-4">Dernières inscriptions</h3>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-navy">{user.email}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.role === "candidat" ? "bg-blue-100 text-blue-700" :
                    user.role === "recruteur" ? "bg-green-100 text-green-700" :
                    "bg-purple-100 text-purple-700"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{user.date}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

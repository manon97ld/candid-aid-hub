import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Eye, MessageCircle, Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecruteurDashboard() {
  const { user } = useAuth();
  const prenom = user?.user_metadata?.prenom || "Recruteur";

  const stats = {
    offresActives: 5,
    candidaturesRecues: 28,
    vuesOffres: 150,
    matchs: 8
  };

  const offres = [
    { id: 1, titre: "Développeur Full Stack", candidatures: 12, vues: 45, statut: "Active" },
    { id: 2, titre: "Chef de projet IT", candidatures: 8, vues: 32, statut: "Active" },
    { id: 3, titre: "UX Designer", candidatures: 8, vues: 73, statut: "Active" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="bg-gradient-to-r from-navy to-navy-light text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Bonjour {prenom} ! 👋</h1>
            <p className="text-white/70">
              Trouvez vos prochains talents avec Candid'aide
            </p>
          </div>
          <Button asChild className="btn-gold">
            <Link to="/app/recruteur/offres/nouvelle">
              <Plus className="w-4 h-4 mr-2" />
              Publier une offre
            </Link>
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.offresActives}</p>
              <p className="text-sm text-gray-500">Offres actives</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.candidaturesRecues}</p>
              <p className="text-sm text-gray-500">Candidatures</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.vuesOffres}</p>
              <p className="text-sm text-gray-500">Vues totales</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.matchs}</p>
              <p className="text-sm text-gray-500">Matchs</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Offres */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-navy">Mes offres</h3>
          <Link to="/app/recruteur/offres" className="text-gold text-sm font-medium hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Offre</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Candidatures</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Vues</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offres.map((offre) => (
                <tr key={offre.id} className="border-b last:border-0">
                  <td className="py-4 px-4">
                    <p className="font-medium text-navy">{offre.titre}</p>
                  </td>
                  <td className="py-4 px-4 text-center">{offre.candidatures}</td>
                  <td className="py-4 px-4 text-center">{offre.vues}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {offre.statut}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="outline" size="sm">Voir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, Search, Target, TrendingUp, Clock, 
  CheckCircle, ArrowRight, Star
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CandidatDashboard() {
  const { user } = useAuth();
  const prenom = user?.user_metadata?.prenom || user?.email?.split("@")[0] || "Candidat";

  // Mock data
  const stats = {
    candidaturesEnvoyees: 12,
    tauxReponse: 25,
    entretiens: 2,
    offresEnAttente: 5
  };

  const nextBestAction = {
    icon: Target,
    title: "5 offres à valider",
    description: "Ton assistant a trouvé des opportunités pour toi",
    action: "Voir les offres",
    link: "/app/offres"
  };

  const recentActivity = [
    { id: 1, action: "Candidature envoyée", detail: "Développeur chez TechCorp", date: "Il y a 2h" },
    { id: 2, action: "Nouvelle offre suggérée", detail: "Chef de projet IT", date: "Il y a 5h" },
    { id: 3, action: "Profil mis à jour", detail: "CV analysé", date: "Hier" },
  ];

  const suggestedOffers = [
    { id: 1, title: "Développeur Full Stack", company: "StartupX", location: "Bruxelles", score: 92 },
    { id: 2, title: "Chef de projet digital", company: "AgencyPro", location: "Liège", score: 87 },
    { id: 3, title: "Consultant IT", company: "ConsultCorp", location: "Namur", score: 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-navy to-navy-light text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Bonjour {prenom} ! 👋
            </h1>
            <p className="text-white/70">
              Voici ton activité de recherche d'emploi
            </p>
          </div>
          <div className="hidden md:block">
            <Button asChild className="btn-gold">
              <Link to="/app/offres">
                Voir les offres
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.candidaturesEnvoyees}</p>
              <p className="text-sm text-gray-500">Candidatures</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.tauxReponse}%</p>
              <p className="text-sm text-gray-500">Taux réponse</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.entretiens}</p>
              <p className="text-sm text-gray-500">Entretiens</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.offresEnAttente}</p>
              <p className="text-sm text-gray-500">En attente</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Next Best Action */}
        <Card className="lg:col-span-2 p-6 border-l-4 border-l-gold">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
              <nextBestAction.icon className="w-6 h-6 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-navy mb-1">
                {nextBestAction.title}
              </h3>
              <p className="text-gray-500 mb-4">{nextBestAction.description}</p>
              <Button asChild className="btn-gold">
                <Link to={nextBestAction.link}>
                  {nextBestAction.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy mb-4">Activité récente</h3>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gold mt-2" />
                <div>
                  <p className="text-sm font-medium text-navy">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Suggested Offers */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-navy">Offres recommandées pour toi</h3>
          <Link to="/app/offres" className="text-gold text-sm font-medium hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {suggestedOffers.map((offer) => (
            <div key={offer.id} className="border rounded-xl p-4 hover:border-gold transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-1 text-gold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">{offer.score}%</span>
                </div>
              </div>
              <h4 className="font-medium text-navy mb-1">{offer.title}</h4>
              <p className="text-sm text-gray-500">{offer.company}</p>
              <p className="text-xs text-gray-400">{offer.location}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

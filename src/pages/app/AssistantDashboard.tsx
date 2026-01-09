import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, MessageCircle, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AssistantDashboard() {
  const { user } = useAuth();
  const prenom = user?.user_metadata?.prenom || "Assistant";

  const stats = {
    candidatsGeres: 12,
    candidaturesATraiter: 8,
    messagesNonLus: 3,
    candidaturesEnvoyees: 45
  };

  const candidats = [
    { id: 1, nom: "Marie Dupont", mode: "Assisté", lastActivity: "Il y a 1h", candidatures: 5 },
    { id: 2, nom: "Jean Martin", mode: "Délégation", lastActivity: "Il y a 3h", candidatures: 12 },
    { id: 3, nom: "Sophie Bernard", mode: "Assisté", lastActivity: "Hier", candidatures: 3 },
  ];

  const tasks = [
    { id: 1, type: "candidature", text: "Préparer candidature pour Marie - Poste développeur", urgent: true },
    { id: 2, type: "message", text: "Répondre au message de Jean Martin", urgent: false },
    { id: 3, type: "suivi", text: "Relancer candidature Sophie - 7 jours sans réponse", urgent: false },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="bg-gradient-to-r from-navy to-navy-light text-white p-6">
        <h1 className="text-2xl font-bold mb-1">Bonjour {prenom} ! 👋</h1>
        <p className="text-white/70">
          Tu gères actuellement {stats.candidatsGeres} candidats
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
              <p className="text-2xl font-bold text-navy">{stats.candidatsGeres}</p>
              <p className="text-sm text-gray-500">Candidats</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.candidaturesATraiter}</p>
              <p className="text-sm text-gray-500">À traiter</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.messagesNonLus}</p>
              <p className="text-sm text-gray-500">Messages</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.candidaturesEnvoyees}</p>
              <p className="text-sm text-gray-500">Envoyées</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy mb-4">Tâches du jour</h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  task.urgent ? "border-red-200 bg-red-50" : "border-gray-100"
                }`}
              >
                {task.urgent && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                <p className="text-sm text-gray-700">{task.text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Candidats */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">Mes candidats</h3>
            <Link to="/app/assistant/candidats" className="text-gold text-sm font-medium hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {candidats.map((candidat) => (
              <div key={candidat.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {candidat.nom.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-navy">{candidat.nom}</p>
                    <p className="text-xs text-gray-500">
                      {candidat.mode} • {candidat.candidatures} candidatures
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{candidat.lastActivity}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

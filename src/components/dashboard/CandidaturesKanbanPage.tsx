import { useState, useEffect } from "react";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "react-beautiful-dnd";
import { 
  MoreHorizontal, 
  Building2, 
  MapPin, 
  Calendar, 
  MessageSquare,
  Eye,
  Trash2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Candidature, CandidatureStatut, STATUT_LABELS, STATUT_COLORS } from "@/types/offers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for demo
const MOCK_CANDIDATURES: Candidature[] = [
  {
    id: "1",
    candidat_id: "user-1",
    offre_id: "offre-1",
    statut: "proposee",
    score_matching: 85,
    date_envoi: null,
    created_at: new Date().toISOString(),
    notes: null,
    offre: {
      id: "offre-1",
      titre: "Développeur React",
      entreprise: "Tech Company",
      lieu: "Bruxelles",
      code_postal: "1000",
      type_contrat: "CDI",
      description: null,
      date_publication: new Date().toISOString(),
      source: "Forem",
      lien_candidature: null,
      domaine: "IT"
    }
  },
  {
    id: "2",
    candidat_id: "user-1",
    offre_id: "offre-2",
    statut: "approuvee",
    score_matching: 72,
    date_envoi: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    notes: "En attente d'envoi",
    offre: {
      id: "offre-2",
      titre: "Commercial B2B",
      entreprise: "Vente Pro",
      lieu: "Liège",
      code_postal: "4000",
      type_contrat: "CDI",
      description: null,
      date_publication: new Date().toISOString(),
      source: "Indeed",
      lien_candidature: null,
      domaine: "Commerce"
    }
  },
  {
    id: "3",
    candidat_id: "user-1",
    offre_id: "offre-3",
    statut: "envoyee",
    score_matching: 90,
    date_envoi: new Date(Date.now() - 172800000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(),
    notes: null,
    offre: {
      id: "offre-3",
      titre: "Chef de projet digital",
      entreprise: "Agency Digital",
      lieu: "Bruxelles",
      code_postal: "1050",
      type_contrat: "CDI",
      description: null,
      date_publication: new Date().toISOString(),
      source: "LinkedIn",
      lien_candidature: null,
      domaine: "Marketing"
    }
  },
  {
    id: "4",
    candidat_id: "user-1",
    offre_id: "offre-4",
    statut: "entretien",
    score_matching: 88,
    date_envoi: new Date(Date.now() - 432000000).toISOString(),
    created_at: new Date(Date.now() - 518400000).toISOString(),
    notes: "Entretien prévu le 15/01",
    offre: {
      id: "offre-4",
      titre: "Data Analyst",
      entreprise: "Finance Corp",
      lieu: "Bruxelles",
      code_postal: "1000",
      type_contrat: "CDI",
      description: null,
      date_publication: new Date().toISOString(),
      source: "Forem",
      lien_candidature: null,
      domaine: "Finance"
    }
  }
];

const COLUMNS: CandidatureStatut[] = ['proposee', 'approuvee', 'envoyee', 'entretien', 'refusee'];

export function CandidaturesKanbanPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>(MOCK_CANDIDATURES);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatut = destination.droppableId as CandidatureStatut;

    setCandidatures(prev => 
      prev.map(c => 
        c.id === draggableId ? { ...c, statut: newStatut } : c
      )
    );

    toast.success(`Candidature déplacée vers "${STATUT_LABELS[newStatut]}"`);
  };

  const getCandidaturesByStatut = (statut: CandidatureStatut) => 
    candidatures.filter(c => c.statut === statut);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Mes candidatures</h1>
        <p className="text-gray-500">
          {candidatures.length} candidatures en cours
        </p>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 min-w-max">
            {COLUMNS.map((statut) => (
              <div key={statut} className="w-72 flex-shrink-0">
                <div className={cn(
                  "rounded-t-lg px-4 py-2 border-b-2",
                  statut === 'proposee' && "bg-blue-50 border-blue-300",
                  statut === 'approuvee' && "bg-green-50 border-green-300",
                  statut === 'envoyee' && "bg-purple-50 border-purple-300",
                  statut === 'entretien' && "bg-gold/10 border-gold",
                  statut === 'refusee' && "bg-red-50 border-red-300"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {STATUT_LABELS[statut]}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {getCandidaturesByStatut(statut).length}
                    </Badge>
                  </div>
                </div>

                <Droppable droppableId={statut}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "bg-gray-50 rounded-b-lg p-2 min-h-[400px] space-y-2 transition-colors",
                        snapshot.isDraggingOver && "bg-gray-100"
                      )}
                    >
                      {getCandidaturesByStatut(statut).map((candidature, index) => (
                        <Draggable 
                          key={candidature.id} 
                          draggableId={candidature.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "cursor-grab active:cursor-grabbing bg-white",
                                snapshot.isDragging && "shadow-lg ring-2 ring-gold"
                              )}
                            >
                              <CardContent className="p-3 space-y-2">
                                {/* Title */}
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium text-sm text-navy line-clamp-2">
                                    {candidature.offre?.titre}
                                  </h4>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Voir détails
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Ajouter note
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {/* Company & Location */}
                                <div className="space-y-1 text-xs text-gray-500">
                                  {candidature.offre?.entreprise && (
                                    <div className="flex items-center gap-1">
                                      <Building2 className="w-3 h-3" />
                                      {candidature.offre.entreprise}
                                    </div>
                                  )}
                                  {candidature.offre?.lieu && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {candidature.offre.lieu}
                                    </div>
                                  )}
                                </div>

                                {/* Score & Date */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                  {candidature.score_matching && (
                                    <Badge 
                                      variant="secondary" 
                                      className={cn(
                                        "text-xs",
                                        candidature.score_matching >= 80 && "bg-green-100 text-green-700",
                                        candidature.score_matching >= 60 && candidature.score_matching < 80 && "bg-gold/20 text-gold-dark",
                                        candidature.score_matching < 60 && "bg-orange-100 text-orange-700"
                                      )}
                                    >
                                      {candidature.score_matching}% match
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(candidature.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short' })}
                                  </span>
                                </div>

                                {/* Notes */}
                                {candidature.notes && (
                                  <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 italic">
                                    💬 {candidature.notes}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Search, MapPin, Building2, Calendar, ExternalLink, Briefcase, Filter, RefreshCw, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOffers } from "@/hooks/useOffers";
import { Offer } from "@/types/offers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OffersListPage() {
  const { offers, loading, error, total, fetchOffers } = useOffers();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedOffers, setSavedOffers] = useState<string[]>([]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleSearch = () => {
    fetchOffers(searchQuery);
  };

  const toggleSaveOffer = (offerId: string) => {
    if (savedOffers.includes(offerId)) {
      setSavedOffers(savedOffers.filter(id => id !== offerId));
      toast.info("Offre retirée des favoris");
    } else {
      setSavedOffers([...savedOffers, offerId]);
      toast.success("Offre ajoutée aux favoris");
    }
  };

  const handleApply = (offer: Offer) => {
    toast.success(`Candidature initiée pour "${offer.titre}"`);
    // TODO: Create candidature in database
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Offres d'emploi</h1>
          <p className="text-gray-500">
            {total} offres disponibles via le Forem
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => fetchOffers(searchQuery)}
          disabled={loading}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
          Actualiser
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un métier, une entreprise, une ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="btn-gold">
              Rechercher
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Offers List */}
      {!loading && offers.length > 0 && (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <Card 
              key={offer.id} 
              className="hover:border-gold/50 transition-colors group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Title */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-navy group-hover:text-gold transition-colors">
                          {offer.titre}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          {offer.entreprise && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {offer.entreprise}
                            </span>
                          )}
                          {offer.lieu && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {offer.lieu} {offer.code_postal && `(${offer.code_postal})`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {offer.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {offer.description}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {offer.type_contrat && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {offer.type_contrat}
                        </Badge>
                      )}
                      {offer.domaine && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          {offer.domaine}
                        </Badge>
                      )}
                      {offer.source && (
                        <Badge variant="outline">{offer.source}</Badge>
                      )}
                      {offer.date_publication && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(offer.date_publication).toLocaleDateString('fr-BE')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="btn-gold"
                      onClick={() => handleApply(offer)}
                    >
                      Postuler
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleSaveOffer(offer.id)}
                      className={cn(
                        savedOffers.includes(offer.id) && "border-red-300 text-red-500"
                      )}
                    >
                      <Heart 
                        className={cn(
                          "w-4 h-4 mr-1",
                          savedOffers.includes(offer.id) && "fill-red-500"
                        )} 
                      />
                      {savedOffers.includes(offer.id) ? "Sauvé" : "Sauver"}
                    </Button>
                    {offer.lien_candidature && (
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <a 
                          href={offer.lien_candidature} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Détails
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && offers.length === 0 && !error && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-navy mb-2">
              Aucune offre trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button onClick={() => { setSearchQuery(""); fetchOffers(); }}>
              Réinitialiser la recherche
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

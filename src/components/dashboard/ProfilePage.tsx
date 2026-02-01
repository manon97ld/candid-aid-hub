import { useState } from "react";
import { 
  User, Mail, Phone, MapPin, Save, Camera, 
  FileText, Shield, Bell, CreditCard, LogOut,
  Edit2, Check, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface ProfileData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
  avatar_url?: string;
}

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const { status, openCustomerPortal, loading: subLoading } = useSubscription();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<ProfileData>({
    prenom: "",
    nom: "",
    email: user?.email || "",
    telephone: "",
    adresse: "",
    ville: "",
    code_postal: "",
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setProfile(data);
        setFormData({
          prenom: data.prenom || "",
          nom: data.nom || "",
          email: data.email || user.email || "",
          telephone: data.telephone || "",
          adresse: data.adresse || "",
          ville: data.ville || "",
          code_postal: data.code_postal || "",
          avatar_url: data.avatar_url || "",
        });
      }
    }
    loadProfile();
  }, [user]);

  const [notifications, setNotifications] = useState({
    email_offres: true,
    email_candidatures: true,
    sms_entretiens: false,
    newsletter: true,
  });

  const profileCompletion = 65; // TODO: Calculate from actual data

  const handleSave = async () => {
    try {
      // TODO: Save to Supabase
      toast.success("Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast.error("Erreur lors de l'ouverture du portail");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Mon profil</h1>
          <p className="text-gray-500">Gère tes informations personnelles</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave} className="btn-gold">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* Avatar & Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-navy text-white text-2xl">
                      {formData.prenom?.[0]}{formData.nom?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-lg hover:bg-gold-light transition-colors">
                      <Camera className="w-4 h-4 text-navy" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-navy">
                    {formData.prenom} {formData.nom}
                  </h2>
                  <p className="text-gray-500">{formData.email}</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Profil complété</span>
                      <span className="font-medium text-navy">{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-gold" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="telephone"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Textarea
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="code_postal">Code postal</Label>
                  <Input
                    id="code_postal"
                    value={formData.code_postal}
                    onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold" />
                Mon abonnement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-navy to-navy-light rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="bg-gold text-navy mb-2">
                      {status?.mode_service === 'delegation' ? 'Premium' : 
                       status?.mode_service === 'assiste' ? 'Assisté' : 'Gratuit'}
                    </Badge>
                    <h3 className="text-lg font-semibold">
                      Plan {status?.plan_type || 'Gratuit'}
                    </h3>
                    {status?.subscription_end && (
                      <p className="text-white/70 text-sm">
                        Renouvellement le {new Date(status.subscription_end).toLocaleDateString('fr-BE')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {status?.subscribed ? '30€' : '0€'}
                    </p>
                    <p className="text-white/70 text-sm">/mois</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {status?.subscribed ? (
                  <Button 
                    onClick={handleManageSubscription}
                    disabled={subLoading}
                    className="flex-1"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Gérer mon abonnement
                  </Button>
                ) : (
                  <Button className="flex-1 btn-gold">
                    Passer à Premium
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gold" />
                Préférences de notifications
              </CardTitle>
              <CardDescription>
                Choisis comment tu veux être informé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'email_offres', label: "Nouvelles offres par email", desc: "Reçois les offres correspondant à ton profil" },
                { key: 'email_candidatures', label: "Mises à jour candidatures", desc: "Sois informé du statut de tes candidatures" },
                { key: 'sms_entretiens', label: "Rappels d'entretien par SMS", desc: "Reçois un SMS avant tes entretiens" },
                { key: 'newsletter', label: "Newsletter conseils emploi", desc: "Astuces et conseils hebdomadaires" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium text-navy">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                Sécurité du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy">Mot de passe</p>
                    <p className="text-sm text-gray-500">Dernière modification: il y a 30 jours</p>
                  </div>
                  <Button variant="outline">Modifier</Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy">Authentification à deux facteurs</p>
                    <p className="text-sm text-gray-500">Ajoute une couche de sécurité supplémentaire</p>
                  </div>
                  <Button variant="outline">Activer</Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-700">Supprimer mon compte</p>
                    <p className="text-sm text-red-600">Cette action est irréversible</p>
                  </div>
                  <Button variant="destructive">Supprimer</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            onClick={() => signOut()}
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

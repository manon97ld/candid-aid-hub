import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { WelcomeAgent } from "@/components/WelcomeAgent";
import { cn } from "@/lib/utils";

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading: authLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/app");
    }
  }, [user, authLoading, navigate]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide";
    
    if (!password) newErrors.password = "Le mot de passe est requis";
    else if (!isLogin && password.length < 8) newErrors.password = "Minimum 8 caractères";
    
    if (!isLogin) {
      if (!prenom) newErrors.prenom = "Le prénom est requis";
      if (!nom) newErrors.nom = "Le nom est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Email ou mot de passe incorrect");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Connexion réussie !");
          navigate("/app");
        }
      } else {
        const { error } = await signUp(email, password, { prenom, nom });
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("Cet email est déjà utilisé");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Compte créé avec succès !");
          navigate("/app");
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-navy">
            Candid'<span className="text-gold">aide</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Toggle */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={cn(
                  "flex-1 py-2 rounded-md text-sm font-medium transition-all",
                  isLogin ? "bg-white shadow text-navy" : "text-gray-500"
                )}
              >
                Connexion
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={cn(
                  "flex-1 py-2 rounded-md text-sm font-medium transition-all",
                  !isLogin ? "bg-white shadow text-navy" : "text-gray-500"
                )}
              >
                Inscription
              </button>
            </div>

            <h1 className="text-2xl font-bold text-navy mb-2">
              {isLogin ? "Content de te revoir !" : "Crée ton compte"}
            </h1>
            <p className="text-gray-500 mb-6">
              {isLogin 
                ? "Connecte-toi pour accéder à ton espace" 
                : "Rejoins Candid'aide et trouve ton emploi"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom">Prénom</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="prenom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className={cn("pl-10", errors.prenom && "border-red-500")}
                        placeholder="Prénom"
                      />
                    </div>
                    {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                  </div>
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className={cn("pl-10", errors.nom && "border-red-500")}
                        placeholder="Nom"
                      />
                    </div>
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn("pl-10", errors.email && "border-red-500")}
                    placeholder="ton@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn("pl-10 pr-10", errors.password && "border-red-500")}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-sm text-gold hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isLogin ? "Connexion..." : "Création..."}
                  </>
                ) : (
                  isLogin ? "Se connecter" : "Créer mon compte"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              {isLogin ? (
                <>
                  Pas encore de compte ?{" "}
                  <button 
                    onClick={() => setIsLogin(false)}
                    className="text-gold font-medium hover:underline"
                  >
                    Inscris-toi
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <button 
                    onClick={() => setIsLogin(true)}
                    className="text-gold font-medium hover:underline"
                  >
                    Connecte-toi
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            En continuant, tu acceptes nos{" "}
            <a href="/cgu" className="text-gold hover:underline">CGU</a>
            {" "}et notre{" "}
            <a href="/confidentialite" className="text-gold hover:underline">Politique de confidentialité</a>
          </p>
        </div>
      </main>

      <WelcomeAgent />
    </div>
  );
};

export default Auth;

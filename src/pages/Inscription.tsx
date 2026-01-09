import { Link } from "react-router-dom";

const Inscription = () => {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy mb-4">Tunnel d'inscription</h1>
        <p className="text-gray-600 mb-6">Le tunnel d'inscription en 7 étapes sera implémenté prochainement.</p>
        <Link to="/" className="btn-gold">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default Inscription;

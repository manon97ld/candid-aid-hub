import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="py-20 bg-navy text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Intro */}
          <p className="text-white/70 mb-4">
            Chacun a son histoire. Mais tous partagent la même envie :
          </p>

          {/* Main Heading */}
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
            <span className="text-gold">Avancer.</span> Et c'est là que Candid'aide entre en scène.
          </h2>

          {/* Description */}
          <div className="space-y-4 text-white/80 mb-8">
            <p>
              Nous cherchons les offres, rédigeons les candidatures, créons ou mettons à jour les profils en ligne, et nous postulons <span className="text-gold font-semibold">à ta place</span>, avec soin, méthode et en toute confidentialité.
            </p>
            <p>
              Peu importe ton âge, ton parcours ou ton niveau d'études — étudiant, parent, salarié, chômeur ou en reconversion — nous faisons le travail concret, celui que tu n'as plus le temps ou la force de faire.
            </p>
          </div>

          {/* Highlighted Box */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <p className="text-gold font-medium mb-2">
              Parce qu'au fond, tout le monde mérite de se sentir soutenu.
            </p>
            <p className="text-white/70">
              Et si, cette fois, c'était toi qu'on aidait à décrocher ton prochain poste ?
            </p>
          </div>

          {/* CTA */}
          <Link to="/inscription" className="btn-gold">
            Je veux qu'on m'aide
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;

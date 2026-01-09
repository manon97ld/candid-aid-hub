import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Choisis ta formule",
      description: "Candidature à l'unité (3€), Pack Coup de boost (20€), ou Pack À fond pour toi (40€). Paiement sécurisé en ligne."
    },
    {
      number: "02",
      title: "Remplis le formulaire",
      description: "Coordonnées, documents, expériences, objectifs professionnels... On a besoin de ces infos pour créer ton dossier complet."
    },
    {
      number: "03",
      title: "On prépare ton dossier",
      description: "Mise à jour de ton CV si besoin, préparation de la lettre de motivation, création de ton adresse mail dédiée."
    },
    {
      number: "04",
      title: "On postule pour toi",
      description: "Recherche d'offres sur Forem, Indeed, Jobat... Candidatures personnalisées envoyées en ton nom, en toute confidentialité."
    },
    {
      number: "05",
      title: "Tu suis tout en temps réel",
      description: "Pour une transparence totale, vous disposez d'un tableau de bord personnel regroupant toutes les opportunités observées. Après chaque envoi, je vous envoie les détails du poste et l'URL de l'annonce : vous gardez ainsi le contrôle final sur chaque postulation. Une fois validée, la candidature est traitée et votre tableau est mis à jour en temps réel avec la date d'envoi, le canal utilisé et les preuves d'expédition (screenshot). Vous y retrouvez également les versions personnalisées de votre CV et de vos lettres de motivation pour chaque offre, vous permettant de suivre l'évolution de vos démarches avec précision et sérénité."
    }
  ];

  return (
    <section id="comment-ca-marche" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="section-badge">
            <span>📋</span>
            <span>Notre Méthode</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy mb-4">
            Comment ça <span className="text-gold">marche</span> ?
          </h2>
          <p className="text-gray-600">
            Un processus simple et transparent pour t'accompagner vers ton prochain emploi en Belgique.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                <span className="text-gold font-bold text-sm">{step.number}</span>
              </div>
              <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-navy mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important Note */}
        <div className="max-w-3xl mx-auto bg-gold/5 border border-gold/20 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gold">⚠️</span>
            </div>
            <div>
              <h4 className="font-semibold text-navy mb-2">
                Après ta commande : une étape indispensable
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                Pour pouvoir commencer la recherche d'emploi, nous avons besoin de créer ton dossier complet.{" "}
                <strong className="text-navy">Une fois ta commande passée, tu recevras un formulaire à remplir.</strong>
              </p>
              <p className="text-gray-500 text-sm">
                Sans ce formulaire, nous ne pouvons pas lancer ton accompagnement car il nous manquerait les éléments essentiels. Dès qu'il sera complété, nous prendrons tout en charge !
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/inscription" className="btn-navy">
            Voir les formules
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

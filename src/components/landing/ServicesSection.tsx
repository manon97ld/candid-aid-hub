import { Search, FileText, Send, LayoutDashboard, Shield, Clock, Award, Heart } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Search,
      title: "Recherche d'offres ciblées",
      description: "Nous analysons le marché pour trouver, forem, Indeed, Jobat et les meilleurs sites spécialisés. Filtrée pour trouver les offres qui te correspondent vraiment."
    },
    {
      icon: FileText,
      title: "CV & lettres personnalisées",
      description: "Chaque candidature reçoit son propre CV adapté et sa lettre de motivation sur-mesure. Rédigés pour maximiser tes chances."
    },
    {
      icon: Send,
      title: "On postule à ta place",
      description: "Nous remplissons les candidatures pour toi sur les plateformes, envoyons les emails en ton nom (signature : Tu n'as rien à faire !)"
    },
    {
      icon: LayoutDashboard,
      title: "Tableau de suivi complet",
      description: "Tu suis toutes tes candidatures en temps réel depuis ton tableau de bord personnel. Tout est clair, rien ne t'échappe."
    },
    {
      icon: Shield,
      title: "100% confidentiel",
      description: "Adresse email dédiée, données protégées. Ton employeur actuel ne saura jamais que tu cherches ailleurs."
    },
    {
      icon: Clock,
      title: "Gain de temps énorme",
      description: "Fini les heures perdues à chercher, l'angoisse de la page vide et qui coulent : préparer les candidatures."
    },
    {
      icon: Award,
      title: "Qualité sur quantité",
      description: "Des candidatures ciblées et professionnelles qui maximisent tes chances d'être remarqué(e)."
    },
    {
      icon: Heart,
      title: "Soulagement mental",
      description: "Plus de charge mentale, plus de démotivation. On gère les démarches, tu retrouves la confiance."
    }
  ];

  return (
    <section id="services" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="section-badge">
            <span>⚡</span>
            <span>Nos Services</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy mb-4">
            Un accompagnement <span className="text-gold">complet</span> en Belgique
          </h2>
          <p className="text-gray-600">
            De la recherche d'offres sur le Forem et Indeed à l'envoi des candidatures, on s'occupe de tout pour que tu décroches enfin des entretiens.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="card-candidaide text-center">
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <service.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-semibold text-navy mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

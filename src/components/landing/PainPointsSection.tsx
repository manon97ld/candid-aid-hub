const PainPointsSection = () => {
  const testimonials = [
    {
      initial: "S",
      name: "Sarah",
      situation: "Étudiante, en fin d'études",
      content: "Elle jongle entre ses cours, son job étudiant et ses candidatures de stage. Chaque semaine, elle se promet d'envoyer un CV de plus, mais le temps lui échappe toujours."
    },
    {
      initial: "A",
      name: "Ahmed",
      situation: "En reconversion professionnelle",
      content: "Il rêve d'une reconversion vers un métier plus stable, plus humain, mais après des heures de travail debout, il n'a plus la force d'ouvrir un ordinateur."
    },
    {
      initial: "S",
      name: "Sophie",
      situation: "Maman solo",
      content: "Elle voudrait relancer sa carrière tout en s'occupant de ses enfants. Le soir, elle pose le cartable, elle s'endormirait entre deux bisous, faute d'énergie."
    },
    {
      initial: "M",
      name: "Marc",
      situation: "Chômeur depuis plusieurs mois",
      content: "Il envoie des candidatures à la chaîne, adapte chaque lettre, relit chaque phrase, mais les réponses ne viennent pas. À force de silence, la confiance s'effrite."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="section-badge">
            <span>💭</span>
            <span>Réalités des chercheurs d'emploi</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy mb-4">
            Tu fais tout bien. Tu postules, tu t'appliques, tu espères.{" "}
            <span className="text-gold">Et malgré tout... rien.</span>
          </h2>
          <p className="text-gray-600 mb-4">
            Les mails restent sans réponse. Le moral, lui, descend doucement.
          </p>
          <p className="text-gray-600">
            Tu sais qu'il faut t'y remettre, mais{" "}
            <strong className="text-navy">par où commencer</strong> ?
          </p>
          <p className="text-gray-500 mt-2 italic">
            Ton CV te ressemble à moitié, ta motivation à peine ?
          </p>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 text-gold bg-gold/5">
            <span>👥</span>
            <span className="font-medium">Tu n'es pas seul(e).</span>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card-candidaide">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold">
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-semibold text-navy">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.situation}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {testimonial.content}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-gray-600 mb-2">
            Et derrière eux, il y a tous les autres :
          </p>
          <p className="text-navy font-medium">
            les actifs <span className="text-gold underline">débordés</span>, 
            les salariés épuisés, les parents coupés en quatre,
          </p>
          <p className="text-gray-600">
            ou ceux qui ne maîtrisent pas les <span className="text-gold underline">outils numériques</span>{" "}
            et se sentent perdus face à la recherche d'emploi.
          </p>
          <p className="text-gray-500 mt-4 italic">
            Ils savent qu'ils doivent postuler, mais remettent toujours à demain.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;

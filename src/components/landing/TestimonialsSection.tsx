const TestimonialsSection = () => {
  const testimonials = [
    {
      rating: 5,
      content: "Grâce à Candid'aide, j'ai décroché un CDI en moins de 3 semaines ! Le service est professionnel et l'équipe très réactive. Je recommande à 100%.",
      name: "Marie D.",
      role: "Assistante administrative",
      location: "Charleroi"
    },
    {
      rating: 5,
      content: "Je n'avais plus le temps de chercher un emploi avec mes horaires décalés. Candid'aide s'est occupé de tout. Résultat : 3 entretiens en 2 semaines !",
      name: "Thomas L.",
      role: "Comptable",
      location: "Liège"
    },
    {
      rating: 5,
      content: "Les lettres de motivation personnalisées ont fait la différence. J'ai reçu beaucoup plus de réponses qu'avant. Un service vraiment efficace.",
      name: "Sophie M.",
      role: "Développeuse Web",
      location: "Bruxelles"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="section-badge">
            <span>💬</span>
            <span>Témoignages</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy mb-4">
            Ce que disent nos <span className="text-gold">clients</span>
          </h2>
          <p className="text-gray-600">
            Des centaines de personnes ont trouvé leur emploi grâce à notre accompagnement.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-gold text-lg">★</span>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-navy">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

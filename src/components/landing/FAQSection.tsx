import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Est-ce que Candid'aide postule vraiment à ma place ?",
      answer: "Oui, c'est exactement notre mission ! Nous prenons en charge toutes les démarches pratiques de votre recherche d'emploi : recherche des offres (Forem, Indeed, Jobat, agences d'intérim...), CV envoyé des candidatures, envoi et suivi des candidatures (via LinkedIn si besoin aussi) sans oublier. Vous recevez un tableau de bord avec chacune des fiches que et quand chaque candidature a été envoyée."
    },
    {
      question: "Mes données et mes candidatures sont-elles vraiment confidentielles ?",
      answer: "Absolument. Chaque client dispose d'une adresse e-mail dédiée et sécurisée uniquement pour la recherche d'emploi. Vos données personnelles, CV, informations employeur actuel... rien n'est partagé. Nous travaillons dans le respect total de la vie privée et avec des protocoles stricts. Votre futur H est seul à vous avoir accès à votre tableau de suivi et à votre adresse."
    },
    {
      question: "Quels sont les avantages de Candid'aide ?",
      answer: "Gain de temps considérable, candidatures de qualité professionnelle, suivi transparent de vos démarches, confidentialité totale, et surtout : vous retrouvez de l'énergie mentale pour vous concentrer sur les entretiens plutôt que sur l'envoi de CV."
    },
    {
      question: "Comment fonctionne le processus après ma commande ?",
      answer: "Après votre commande, vous recevez un formulaire détaillé à remplir avec vos informations, votre CV, vos préférences de poste et de localisation. Une fois ce formulaire complété, nous créons votre dossier, préparons votre CV et vos lettres types, puis nous lançons les recherches et candidatures selon votre formule."
    },
    {
      question: "Pourquoi y a-t-il des frais de création de dossier ?",
      answer: "Les 5€ de frais de création couvrent la mise en place de votre espace personnel : création de votre adresse email dédiée, configuration de votre tableau de suivi, analyse de votre profil et préparation de vos documents. C'est un investissement unique pour démarrer votre accompagnement."
    },
    {
      question: "Pour qui est fait ce service ?",
      answer: "Candid'aide s'adresse à tous ceux qui cherchent un emploi en Belgique mais manquent de temps, d'énergie ou de méthode : salariés en poste cherchant discrètement, parents débordés, étudiants, personnes en reconversion, chômeurs découragés, ou simplement ceux qui veulent déléguer cette tâche chronophage."
    },
    {
      question: "Où opérez-vous ?",
      answer: "Nous couvrons toute la Belgique francophone : Namur, Liège, Charleroi, Mons, Bruxelles et partout en Wallonie. Service 100% en ligne."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="section-badge">
            <span>❓</span>
            <span>Questions fréquentes</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy mb-4">
            Tout ce que tu veux <span className="text-gold">savoir</span>
          </h2>
          <p className="text-gray-600">
            Les réponses aux questions les plus posées sur notre service de recherche d'emploi en Belgique.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-navy pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gold flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Links */}
        <div className="text-center mt-8">
          <p className="text-gray-500 mb-2">Tu as encore des questions ?</p>
          <a href="#contact" className="text-gold hover:underline font-medium">
            Contacte-nous par email
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

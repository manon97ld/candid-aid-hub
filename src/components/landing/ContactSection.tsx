import { Phone, MessageCircle, Mail, Facebook, Instagram, MapPin, Upload } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="section-badge">
            <span>📞</span>
            <span>Nous contacter</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy mb-4">
            Une question ? <span className="text-gold">Écris-nous !</span>
          </h2>
          <p className="text-gray-600">
            On est là pour t'aider. Contacte-nous par le moyen qui te convient le mieux.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Buttons */}
          <div className="space-y-6">
            <h3 className="font-semibold text-navy mb-4">Contacte-nous directement</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="tel:0456962073" className="contact-btn contact-btn-primary">
                <Phone className="w-5 h-5" />
                <div>
                  <span className="font-medium">Appeler</span>
                  <p className="text-xs opacity-80">0456 96 20 73</p>
                </div>
              </a>

              <a href="https://wa.me/32456962073" target="_blank" rel="noopener noreferrer" className="contact-btn contact-btn-whatsapp">
                <MessageCircle className="w-5 h-5" />
                <div>
                  <span className="font-medium">WhatsApp</span>
                  <p className="text-xs opacity-80">0456 96 20 73</p>
                </div>
              </a>

              <a href="mailto:contact@candidaideemploi.com" className="contact-btn contact-btn-email">
                <Mail className="w-5 h-5" />
                <div>
                  <span className="font-medium">Email</span>
                  <p className="text-xs opacity-80">contact@candidaideemploi.com</p>
                </div>
              </a>

              <a href="https://facebook.com/candidaideemploi" target="_blank" rel="noopener noreferrer" className="contact-btn contact-btn-facebook">
                <Facebook className="w-5 h-5" />
                <div>
                  <span className="font-medium">Facebook</span>
                  <p className="text-xs opacity-80">Candid'Aide Emploi</p>
                </div>
              </a>

              <a href="https://instagram.com/candidaide" target="_blank" rel="noopener noreferrer" className="contact-btn contact-btn-instagram col-span-full sm:col-span-1">
                <Instagram className="w-5 h-5" />
                <div>
                  <span className="font-medium">Instagram</span>
                  <p className="text-xs opacity-80">@candidaide</p>
                </div>
              </a>
            </div>

            {/* Service Area */}
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-6 mt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-2">Zone de service</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    Toute la Belgique francophone : Namur, Liège, Charleroi, Mons, Bruxelles et partout en Wallonie.
                  </p>
                  <p className="text-sm text-gold font-medium">Service 100% en ligne</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-navy mb-6">Envoie-nous un message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nom complet *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ton nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="ton@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="0488 XX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Message *</label>
                <textarea
                  className="form-input min-h-[120px]"
                  placeholder="Décris ta situation ou pose ta question..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Fichiers (CV, documents...)</label>
                <div className="upload-zone flex items-center justify-center gap-2 p-4">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Clique pour ajouter des fichiers</span>
                  <span className="text-xs text-gray-400">(PDF, DOC, images max 10 MB)</span>
                </div>
              </div>

              <button type="submit" className="btn-gold w-full">
                <Mail className="w-4 h-4" />
                Envoyer le message
              </button>

              <p className="text-xs text-gray-500 text-center">
                En envoyant ce formulaire, tu acceptes que nous te recontactions pour répondre à ta demande.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

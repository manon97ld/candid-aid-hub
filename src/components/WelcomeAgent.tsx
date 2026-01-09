import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const WELCOME_MESSAGES: Record<string, string[]> = {
  default: [
    "Bonjour ! 👋 Je suis ton assistant Candid'aide.",
    "Je suis là pour t'aider dans ta recherche d'emploi. Que puis-je faire pour toi aujourd'hui ?",
  ],
  candidat: [
    "Bonjour ! 👋 Bienvenue sur ton espace candidat.",
    "Tu as 1 candidature en attente d'être postulée. Voici quelques offres correspondant à tes critères !",
  ],
};

const QUICK_ACTIONS = [
  { label: "Comment ça marche ?", response: "Candid'aide t'accompagne dans ta recherche d'emploi. Tu peux choisir entre 3 modes : Autonome (gratuit), Assisté (avec un assistant dédié), ou Délégation totale (tout est géré pour toi). Clique sur 'Commencer' pour démarrer !" },
  { label: "Voir les tarifs", response: "Nos formules vont de 0€ (mode autonome) à 60€/mois (délégation totale). Le mode Assisté commence à 20€ pour un pack de 8 candidatures. Tu veux que je t'explique les différences ?" },
  { label: "Parler à un humain", response: "Bien sûr ! Tu peux nous contacter par WhatsApp au +32 471 47 86 93 ou par email à contact@candidaide.be. Nous te répondrons dans les plus brefs délais ! 💬" },
];

interface WelcomeAgentProps {
  variant?: 'default' | 'candidat' | 'assistant' | 'recruteur' | 'admin';
  userName?: string;
}

export function WelcomeAgent({ variant = 'default', userName }: WelcomeAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const initializeChat = () => {
    if (!hasInteracted) {
      const welcomeMessages = WELCOME_MESSAGES[variant] || WELCOME_MESSAGES.default;
      const initialMessages: Message[] = welcomeMessages.map((content, i) => ({
        id: `welcome-${i}`,
        content: userName ? content.replace('!', ` ${userName} !`) : content,
        isBot: true,
        timestamp: new Date(),
      }));
      setMessages(initialMessages);
      setHasInteracted(true);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    initializeChat();
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const quickAction = QUICK_ACTIONS.find(a => 
        content.toLowerCase().includes(a.label.toLowerCase().slice(0, 10))
      );
      
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        content: quickAction?.response || "Merci pour ton message ! Un membre de notre équipe te répondra bientôt. En attendant, n'hésite pas à explorer notre site ou commencer ton inscription. 😊",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110",
          "bg-gold text-navy hover:bg-gold-light"
        )}
      >
        <MessageCircle className="w-6 h-6" />
        {!hasInteracted && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-navy text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="font-semibold">Assistant Candid'aide</p>
                <p className="text-xs text-white/70">En ligne • Répond instantanément</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    message.isBot
                      ? "bg-white border border-gray-200 text-gray-700"
                      : "bg-gold text-navy"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.label)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gold/10 hover:text-gold rounded-full transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écris ton message..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage(input)}
                size="icon"
                className="bg-gold hover:bg-gold-light text-navy"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Check, CheckCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at: string | null;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

// Mock data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    name: "Sophie Martin",
    lastMessage: "J'ai envoyé ta candidature chez TechCorp !",
    lastMessageTime: "10:30",
    unreadCount: 2,
    online: true
  },
  {
    id: "conv-2",
    name: "Support Candid'aide",
    lastMessage: "Votre abonnement a été activé.",
    lastMessageTime: "Hier",
    unreadCount: 0,
    online: true
  },
  {
    id: "conv-3",
    name: "Thomas Dubois",
    lastMessage: "Super, merci pour les conseils !",
    lastMessageTime: "Lun",
    unreadCount: 0,
    online: false
  }
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-1",
    content: "Bonjour ! J'ai trouvé plusieurs offres qui correspondent à ton profil.",
    sender_id: "assistant-1",
    receiver_id: "user-1",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-2",
    content: "Super, je suis intéressé ! Lesquelles ?",
    sender_id: "user-1",
    receiver_id: "assistant-1",
    created_at: new Date(Date.now() - 3000000).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-3",
    content: "Il y a une offre de développeur chez TechCorp et une autre chez Digital Agency. Les deux sont en CDI à Bruxelles.",
    sender_id: "assistant-1",
    receiver_id: "user-1",
    created_at: new Date(Date.now() - 2400000).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-4",
    content: "J'ai préparé ta candidature pour TechCorp. Tu veux que je te montre la lettre de motivation ?",
    sender_id: "assistant-1",
    receiver_id: "user-1",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-5",
    content: "Oui, montre-moi !",
    sender_id: "user-1",
    receiver_id: "assistant-1",
    created_at: new Date(Date.now() - 1200000).toISOString(),
    read_at: new Date().toISOString()
  },
  {
    id: "msg-6",
    content: "J'ai envoyé ta candidature chez TechCorp !",
    sender_id: "assistant-1",
    receiver_id: "user-1",
    created_at: new Date(Date.now() - 600000).toISOString(),
    read_at: null
  }
];

export function MessagingPage() {
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConv) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender_id: "user-1",
      receiver_id: selectedConv.id,
      created_at: new Date().toISOString(),
      read_at: null
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-200px)] flex rounded-xl border overflow-hidden bg-white">
      {/* Conversations List */}
      <div className="w-80 border-r flex flex-col">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={cn(
                "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left",
                selectedConv?.id === conv.id && "bg-gold/5 border-l-2 border-gold"
              )}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={conv.avatar} />
                  <AvatarFallback className="bg-navy text-white">
                    {conv.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-navy truncate">{conv.name}</span>
                  <span className="text-xs text-gray-400">{conv.lastMessageTime}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="w-5 h-5 bg-gold text-navy text-xs font-bold rounded-full flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedConv.avatar} />
                <AvatarFallback className="bg-navy text-white">
                  {selectedConv.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-navy">{selectedConv.name}</h3>
                <p className="text-xs text-gray-500">
                  {selectedConv.online ? "En ligne" : "Hors ligne"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const isMe = message.sender_id === "user-1";
                return (
                  <div
                    key={message.id}
                    className={cn("flex", isMe ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        isMe 
                          ? "bg-gold text-navy rounded-br-sm" 
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={cn(
                        "flex items-center gap-1 mt-1",
                        isMe ? "justify-end" : "justify-start"
                      )}>
                        <span className="text-xs opacity-70">
                          {new Date(message.created_at).toLocaleTimeString('fr-BE', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {isMe && (
                          message.read_at 
                            ? <CheckCheck className="w-3 h-3 text-blue-500" />
                            : <Check className="w-3 h-3 opacity-70" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Écris ton message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Smile className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="btn-gold"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Sélectionne une conversation
        </div>
      )}
    </div>
  );
}

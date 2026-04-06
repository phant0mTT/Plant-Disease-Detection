import React, { useRef, useEffect } from "react";
import { MessageSquareDot, X, Send, Bot } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
  loading?: boolean;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  messages: Message[];
  query: string;
  setQuery: (query: string) => void;
  askBot: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  messages,
  query,
  setQuery,
  askBot
}) => {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    return (
    <>
        <button
        onClick={onOpen}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group z-50"
        >
            <Bot size={32} />
            <span className="absolute -top-2 -right-2 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 text-xs items-center justify-center text-[9px]">
                    AI
                </span> 
            </span>
        </button>

    </>
    );
};
export default ChatWidget;
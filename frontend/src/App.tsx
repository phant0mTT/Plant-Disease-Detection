import { useState } from "react";
import { Camera } from "lucide-react";
import ChatWidget from "./ChatWidget.tsx";

interface Message {
  sender: "user" | "bot";
  text: string;
  loading?: boolean;
}

interface Prediction {
  disease: string;
  confidence: number;
  advice: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<"main" | "detection">(
    "main",
  );
  const [chatOpen, setChatOpen] = useState(false);

  // -----CHAT BOT STATE-----
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const askBot = async () => {
    if (!query.trim()) return;
    setChatOpen(true);
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "...", loading: true },
    ]);
    setQuery("");

    try {
      const response = await fetch("http://localhost:4000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, top_k: 1 }),
      });

      const data = await response.json();
      const answerText =
        Array.isArray(data) && data.length > 0
          ? data[0].answer
          : data.answer || data.answer;

      setTimeout(
        () =>
          setMessages((prev) => [
            ...prev.slice(0, -1), // Remove loading message
            { sender: "bot", text: answerText },
          ]),
        1000,
      );
    } catch (error) {
      console.error("Error fetching answer:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove loading message
        {
          sender: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }
  };

  // ----- DISEASE DETECTION STATE ------
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setResult(null);
    }
  };

  const uploadImage = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:4000/detect", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading image:", error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  if (currentScreen === "main") {
    return (
      <div className="min-h-screen items-center bg-[url('/bg.png')] bg-cover bg-center">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <div className="flex items-center gap-3 p-4">
            <div className="h-16 w-16 overflow-hidden flex-shrink-0">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-full object-cover scale-150"
              />
            </div>

            <h1 className="text-white font-bold text-3xl leading-none">
              Plant AI
            </h1>
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Try our AI powered
              <br />
              Disease Detection
            </h1>

            <button
              className="bg-yellow-500 text-black px-8 py-3 rounded-full shadow hover:bg-gray-200 transition-colors mt-6"
              onClick={() => setCurrentScreen("detection")}
            >
              Detect Disease
            </button>
          </div>

          {/* How it work section */}
          <div className="py-12 px-8 bg-gradient-to-t from-green-700 to-green-500">
            <h2 className="text-[30px] font-semibold text-center text-white mb-12">
              How it works?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 flex rounded-full items-center justify-center text-2xl font-bold text-green-600 mb-4">
                  <Camera size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">
                  Click a Pic
                </h3>
                <p className="text-gray-300 tracking-wide text-sm">
                  Take a picture of your plant
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 flex rounded-full items-center justify-center text-2xl font-bold text-green-600 mb-4">
                  <Camera size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">
                  Click a Pic
                </h3>
                <p className="text-gray-300 tracking-wide text-sm">
                  Take a picture of your plant
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 flex rounded-full items-center justify-center text-2xl font-bold text-green-600 mb-4">
                  <Camera size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">
                  Click a Pic
                </h3>
                <p className="text-gray-300 tracking-wide text-sm">
                  Take a picture of your plant
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 flex rounded-full items-center justify-center text-2xl font-bold text-green-600 mb-4">
                  <Camera size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">
                  Click a Pic
                </h3>
                <p className="text-gray-300 tracking-wide text-sm">
                  Take a picture of your plant
                </p>
              </div>
            </div>
          </div>

          {/*Chatbot Section*/}
          <ChatWidget
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            onOpen={() => setChatOpen(true)}
            messages={messages}
            query={query}
            setQuery={setQuery}
            askBot={askBot}
          />

        </div>
      </div>
    );
  }
  //fallback
  return <div>Loading...</div>;
}
export default App;
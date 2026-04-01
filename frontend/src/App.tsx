import { useState } from 'react'

interface Message {
  sender: "user" | "bot";
  text: string;
  loading?: boolean
}

interface Prediction {
  disease: string;
  confidence: number;
  advice: string
}

function App() {

  const [currentScreen, setCurrentScreen] = useState<'main' | 'detection'>('main');
  const [chatOpen, setChatOpen] = useState(false);

  // -----CHAT BOT STATE-----
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const askBot = async () => {
    if (!query.trim()) return;
    setChatOpen(true);
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setMessages((prev) => [...prev, { sender: 'bot', text: '...', loading: true }]);
    setQuery('');

    try {
      const response = await fetch('http://localhost:4000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: 1 })
      })

      const data = await response.json();
      const answerText = Array.isArray(data) && data.length > 0 ? data[0].answer : data.answer || data.answer;

      setTimeout(() =>
        setMessages((prev) => [
          ...prev.slice(0, -1),  // Remove loading message
          { sender: 'bot', text: answerText }
        ])
        , 1000);
    } catch (error) {
      console.error('Error fetching answer:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1),  // Remove loading message
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }
      ]);
    }
  }


  // ----- DISEASE DETECTION STATE ------
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setResult(null);
    }
  }

  const uploadImage = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file)
  }

  try {
    const response = await fetch('http://localhost:4000/detect', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    setResult(data);
  } catch (error) {
    console.error('Error uploading image:', error);
    setResult(null);
  } finally {
    setLoading(false);
  }

  return (
    <div></div>
  )
}
export default App


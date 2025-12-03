import { useState, useRef, useContext } from "react";
import { userDataContext } from "../Context/UserContext";
import axios from "axios";

const useAssistant = () => {
  const { serverUrl } = useContext(userDataContext);
  const [chats, setChats] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const addChat = (message, type) => {
    setChats(prev => [...prev, {
      message,
      type,
      timestamp: new Date().toISOString()
    }]);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const sendToAPI = async (message) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/ask-assistant`,
        { prompt: message },
        { withCredentials: true }
      );
      
      if (result.data.success) {
        const response = result.data.response;
        addChat(response, 'assistant');
        speak(response);
      }
    } catch (error) {
      console.error("API Error:", error);
      const errorMsg = "Sorry, I couldn't process your request.";
      addChat(errorMsg, 'assistant');
      speak(errorMsg);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setIsListening(true);
    
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addChat(transcript, 'user');
      sendToAPI(transcript);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    
    recognitionRef.current.onerror = () => setIsListening(false);

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const sendText = (text) => {
    if (text.trim()) {
      addChat(text, 'user');
      sendToAPI(text);
    }
  };

  return {
    chats,
    isListening,
    startListening,
    stopListening,
    sendText
  };
};

export default useAssistant;
import React from "react";
import { motion } from "framer-motion";

const VoiceButton = ({ isListening, onStart, onStop }) => {
  return (
    <motion.button
      onClick={isListening ? onStop : onStart}
      className={`mt-6 w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
        isListening
          ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
          : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isListening ? { scale: [1, 1.1, 1] } : {}}
      transition={isListening ? { repeat: Infinity, duration: 1 } : {}}
    >
      {isListening ? '🛑' : '🎤'}
    </motion.button>
  );
};

export default VoiceButton;
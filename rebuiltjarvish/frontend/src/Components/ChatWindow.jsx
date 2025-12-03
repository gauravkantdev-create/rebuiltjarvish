import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatWindow = ({ chats }) => {
  return (
    <div className="h-64 overflow-y-auto space-y-3 custom-scrollbar">
      <AnimatePresence>
        {chats.map((chat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-2xl ${
                chat.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="text-sm">{chat.message}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(chat.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {chats.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>Start a conversation...</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
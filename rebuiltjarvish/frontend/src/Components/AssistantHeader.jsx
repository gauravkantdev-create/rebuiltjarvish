import React from "react";
import { motion } from "framer-motion";

const AssistantHeader = ({ name }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {name || "AI Assistant"}
      </h1>
      <p className="text-gray-400 mt-2">Your intelligent voice companion</p>
    </motion.div>
  );
};

export default AssistantHeader;
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { userDataContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Customize2 = () => {
  const [assistantName, setAssistantName] = useState("");
  const { selectedImage, setAssistantName: setGlobalAssistantName, serverUrl } =
    useContext(userDataContext);
  const navigate = useNavigate();

  // ✅ Save Assistant and Navigate
  const handleNext = async () => {
    if (!assistantName.trim()) {
      alert("Please enter your assistant's name.");
      return;
    }

    try {
      // Save to database
      const response = await axios.put(
        `${serverUrl}/api/auth/update-assistant`,
        {
          assistantName: assistantName.trim(),
          assistantImage: selectedImage || ""
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setGlobalAssistantName(assistantName);
        console.log("✅ Assistant saved successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("❌ Error saving assistant:", error);
      alert("Failed to save assistant. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* 🌌 Animated Gradient Orbs */}
      <motion.div 
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-100px] left-[-100px] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-indigo-500/20 blur-[120px] sm:blur-[180px] rounded-full"
      />
      <motion.div 
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-100px] right-[-100px] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-cyan-500/20 blur-[120px] sm:blur-[180px] rounded-full"
      />

      {/* 🔹 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-center tracking-wide px-4"
      >
        Name Your <span className="text-cyan-400">AI Assistant</span> 🤖
      </motion.h1>

      {/* 🔹 Progress Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-white/60 text-xs sm:text-sm mb-2">
          <span className="bg-purple-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">Step 2</span>
          <span className="hidden sm:inline">Choose Assistant Name</span>
          <span className="sm:hidden">Name Assistant</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 sm:w-8 h-1 bg-green-500 rounded-full"></div>
          <div className="w-6 sm:w-8 h-1 bg-purple-500 rounded-full"></div>
          <div className="w-6 sm:w-8 h-1 bg-white/20 rounded-full"></div>
        </div>
      </motion.div>

      {/* 💫 Floating Card */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotateX: [0, 2, 0],
          boxShadow: [
            "0 0 25px rgba(0,255,255,0.25)",
            "0 0 50px rgba(173,216,230,0.3)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full max-w-sm sm:max-w-md glass-effect rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 text-center shadow-2xl"
      >
        {/* Assistant Avatar */}
        {selectedImage && (
          <motion.img
            src={selectedImage}
            alt="Assistant"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border-3 sm:border-4 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] mb-6"
          />
        )}

        {/* Input Field */}
        <input
          type="text"
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
          placeholder="Enter assistant name..."
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white text-base sm:text-lg placeholder-white/40 outline-none transition-all duration-300"
        />

        {/* Animated Name Preview */}
        {assistantName && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <p className="text-white/60 text-sm mb-2">Assistant Preview:</p>
            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-400 bg-clip-text text-transparent">
              {assistantName}
            </h2>
          </motion.div>
        )}

        {/* Continue Button */}
        {assistantName && (
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-6 sm:mt-8 w-full py-3 sm:py-4 rounded-xl sm:rounded-full font-semibold text-base sm:text-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className="hidden sm:inline">Start Using Assistant 🚀</span>
            <span className="sm:hidden">Start Assistant 🚀</span>
          </motion.button>
        )}
      </motion.div>

      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/customization')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white text-sm font-medium transition-all duration-200 hover:bg-white/20"
      >
        ← Back
      </motion.button>

      {/* Footer */}
      <p className="absolute bottom-4 sm:bottom-6 text-white/40 text-xs sm:text-sm text-center px-4">
        © 2025 AI Customization Hub
      </p>
    </div>
  );
};

export default Customize2;

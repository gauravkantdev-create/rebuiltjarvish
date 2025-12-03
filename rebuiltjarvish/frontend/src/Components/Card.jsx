import React, { useContext } from "react";
import { motion } from "framer-motion";
import { userDataContext } from "../Context/UserContext.jsx";

const Card = ({ image }) => {
  const { setSelectedImage } = useContext(userDataContext);

  const handleSelect = () => {
    setSelectedImage(image);
    console.log("✅ Selected Image:", image);
  };

  return (
    <motion.div
      className="relative w-[250px] h-[350px] rounded-3xl overflow-hidden
      glass-effect border border-white/20
      shadow-2xl hover:shadow-[0_25px_60px_rgba(59,130,246,0.3)]
      transition-all duration-500 cursor-pointer group"
      whileHover={{
        rotateY: 8,
        rotateX: -4,
        scale: 1.05,
        boxShadow: "0 25px 60px rgba(59, 130, 246, 0.4)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
    >
      {/* Enhanced Glow Border */}
      <motion.div
        className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 
        blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10"
      />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

      {/* Image */}
      <motion.img
        src={image}
        alt="assistant-preview"
        className="w-full h-full object-cover rounded-3xl"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Enhanced Overlay with Select Button */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500
        flex flex-col items-center justify-end pb-8 z-20"
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(59,130,246,0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSelect}
          className="glass-effect px-6 py-3 rounded-2xl border border-blue-500/30 
          bg-gradient-to-r from-blue-500/20 to-purple-500/20 
          text-white font-semibold shadow-lg hover:from-blue-500/30 hover:to-purple-500/30 
          transition-all duration-300 backdrop-blur-md"
        >
          <span className="flex items-center space-x-2">
            <span>✨</span>
            <span>Select This Look</span>
          </span>
        </motion.button>
        
        {/* Preview Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="mt-3 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
        >
          <span className="text-white/80 text-xs font-medium">AI Assistant Preview</span>
        </motion.div>
      </motion.div>
      
      {/* Corner Accent */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default Card;

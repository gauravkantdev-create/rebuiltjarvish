import React, { useRef, useContext } from "react";
import Card from "../Components/Card.jsx";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image4.png";
import image4 from "../assets/image5.png";
import image5 from "../assets/image6.jpeg";
import image6 from "../assets/image7.jpeg";
import image7 from "../assets/authBg.png";
import { IoImagesSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { userDataContext } from "../Context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const Customization = () => {
  const images = [image1, image2, image3, image4, image5, image6, image7];
  const inputImage = useRef();
  const navigate = useNavigate();

  const userCtx = useContext(userDataContext);
  if (!userCtx) return null;

  const {
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = userCtx;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFrontendImage(imageURL);
      setSelectedImage(imageURL);
      console.log("✅ Uploaded and selected:", imageURL);
    }
  };

  const handleUploadClick = () => inputImage.current.click();
  const handleReset = () => {
    setSelectedImage(null);
    setFrontendImage(null);
  };

  const handleNext = () => navigate("/customize2");
  const handlePrevious = () => navigate("/signin"); // ✅ Fixed: go back to signin

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-start py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 overflow-hidden safe-area-top safe-area-bottom">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)] animate-pulse"></div>
      
      {/* Floating Elements */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 50, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 80, 0],
          y: [0, 60, -60, 0],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
      />

      {/* Enhanced Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mb-2 tracking-wide mobile-title">
          Customize Your AI Assistant
        </h1>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block text-4xl sm:text-5xl"
        >
          ✨
        </motion.div>
        <p className="text-white/70 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
          Choose the perfect appearance for your AI companion
        </p>
      </motion.div>

      {/* Enhanced Progress Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8 text-center"
      >
        <div className="glass-effect rounded-2xl px-6 py-4 border border-white/10 inline-block">
          <div className="flex items-center justify-center gap-3 text-white/80 text-sm mb-3">
            <motion.span 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
            >
              Step 1 of 2
            </motion.span>
            <span className="hidden sm:inline font-medium">Choose Assistant Appearance</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <motion.div 
              animate={{ width: ["2rem", "2.5rem", "2rem"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"
            />
            <div className="w-8 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </motion.div>

      {/* 🔹 Card Section */}
      <div className="relative w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!selectedImage ? (
            <motion.div
              key="all-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-12"
            >
              {/* 🔹 Grid of images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-6xl w-full justify-items-center tablet-grid">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className="cursor-pointer hover:scale-105 transition-transform duration-500"
                  >
                    <Card image={img} />
                  </div>
                ))}

                {/* Enhanced Upload Custom Image Card */}
                <motion.div
                  onClick={handleUploadClick}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 25px 60px rgba(59,130,246,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                  className="w-[250px] h-[350px] rounded-3xl glass-effect border border-white/20 shadow-2xl flex flex-col items-center justify-center text-white group overflow-hidden relative cursor-pointer hover:border-blue-400/50"
                >
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
                  {frontendImage ? (
                    <motion.img
                      src={frontendImage}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover rounded-3xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                  ) : (
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="flex flex-col items-center gap-4 p-6 text-center"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="p-4 bg-blue-500/20 rounded-full"
                      >
                        <IoImagesSharp className="text-5xl text-blue-300 drop-shadow-lg" />
                      </motion.div>
                      <div>
                        <p className="text-lg font-semibold text-white/90 mb-1">
                          Upload Custom Image
                        </p>
                        <p className="text-sm text-white/60">
                          Click to browse files
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Enhanced Back Button */}
              <motion.button
                onClick={handlePrevious}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(148,163,184,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="glass-effect px-8 py-3 mt-8 rounded-2xl border border-slate-500/30 bg-gradient-to-r from-slate-600/20 to-slate-700/20 text-slate-300 font-semibold shadow-lg hover:from-slate-600/30 hover:to-slate-700/30 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <span>⬅️</span>
                  <span>Back to Sign In</span>
                </span>
              </motion.button>
            </motion.div>
          ) : (
            // 🔹 Show selected card
            <motion.div
              key="selected-card"
              initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 10 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              <motion.img
                src={selectedImage}
                alt="Selected preview"
                className="w-[300px] h-[420px] object-cover rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-2 border-blue-400 transition-transform duration-500 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />

              <div className="flex gap-4">
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-effect px-6 py-3 rounded-xl border border-slate-500/30 bg-gradient-to-r from-slate-600/20 to-slate-700/20 text-slate-300 font-semibold shadow-lg hover:from-slate-600/30 hover:to-slate-700/30 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <span>🔁</span>
                    <span>Choose Again</span>
                  </span>
                </motion.button>

                <motion.button
                  onClick={handleNext}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(59,130,246,0.6)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-effect px-8 py-3 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 font-semibold shadow-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <span>Next Step</span>
                    <span>➡️</span>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputImage}
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Customization;

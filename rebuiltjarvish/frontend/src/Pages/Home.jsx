import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../Context/UserContext";
import AssistantHeader from "../components/AssistantHeader";
import ChatWindow from "../components/ChatWindow";
import VoiceButton from "../components/VoiceButton";
import useAssistant from "../hooks/useAssistant";

const Home = () => {
  const { assistantName, selectedImage, setUserData, setSelectedImage, setAssistantName, setFrontendImage } = useContext(userDataContext);
  const { chats, isListening, startListening, stopListening, sendText } = useAssistant();
  const navigate = useNavigate();

  const [typedText, setTypedText] = useState("");
  const [currentTheme, setCurrentTheme] = useState("cosmic");
  const [showThemes, setShowThemes] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  // Touch gesture handlers
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;
    
    // Handle swipe gestures
    if (isLeftSwipe && Math.abs(distanceX) > Math.abs(distanceY)) {
      // Swipe left - next theme
      const themeKeys = Object.keys(themes);
      const currentIndex = themeKeys.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themeKeys.length;
      setCurrentTheme(themeKeys[nextIndex]);
    } else if (isRightSwipe && Math.abs(distanceX) > Math.abs(distanceY)) {
      // Swipe right - previous theme
      const themeKeys = Object.keys(themes);
      const currentIndex = themeKeys.indexOf(currentTheme);
      const prevIndex = currentIndex === 0 ? themeKeys.length - 1 : currentIndex - 1;
      setCurrentTheme(themeKeys[prevIndex]);
    } else if (isUpSwipe && Math.abs(distanceY) > Math.abs(distanceX)) {
      // Swipe up - toggle themes panel
      setShowThemes(!showThemes);
    } else if (isDownSwipe && Math.abs(distanceY) > Math.abs(distanceX)) {
      // Swipe down - close themes panel
      setShowThemes(false);
    }
  };

  const themes = {
    cosmic: {
      bg: "from-slate-900 via-blue-900 to-purple-900",
      orb1: "from-[#00e1ff] to-[#0077ff]",
      orb2: "from-[#ff00c8] to-[#ff5100]",
      rgb: (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`
    },
    sunset: {
      bg: "from-orange-900 via-red-900 to-pink-900",
      orb1: "from-[#ff6b35] to-[#f7931e]",
      orb2: "from-[#ff006e] to-[#8338ec]",
      rgb: (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`
    },
    forest: {
      bg: "from-green-900 via-emerald-900 to-teal-900",
      orb1: "from-[#10b981] to-[#059669]",
      orb2: "from-[#14b8a6] to-[#0d9488]",
      rgb: (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`
    },
    midnight: {
      bg: "from-gray-900 via-slate-900 to-black",
      orb1: "from-[#6366f1] to-[#4f46e5]",
      orb2: "from-[#8b5cf6] to-[#7c3aed]",
      rgb: (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`
    },
    custom: {
      bg: "from-slate-900 via-blue-900 to-purple-900",
      orb1: "from-[#00e1ff] to-[#0077ff]",
      orb2: "from-[#ff00c8] to-[#ff5100]",
      rgb: (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`,
      customColors: {
        primary: [0, 225, 255],
        secondary: [255, 0, 200],
        accent: [138, 43, 226]
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("selectedImage");
    localStorage.removeItem("assistantName");
    localStorage.removeItem("frontendImage");
    localStorage.removeItem("backendImage");
    
    setUserData(null);
    setSelectedImage(null);
    setAssistantName("");
    setFrontendImage(null);
    navigate("/signin");
  };

  return (
    <div 
      className="flex flex-col lg:flex-row min-h-screen relative overflow-hidden text-white select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${themes[currentTheme].bg} transition-all duration-1000`}></div>
      <div 
        className="absolute inset-0 animate-pulse transition-all duration-1000"
        style={{
          background: currentTheme === 'custom' 
            ? `radial-gradient(circle at 20% 20%, ${themes.custom.rgb(...themes.custom.customColors.primary, 0.3)}, transparent 50%)`
            : 'radial-gradient(circle at 20% 20%, rgba(0,240,255,0.3), transparent 50%)'
        }}
      ></div>
      <div 
        className="absolute inset-0 animate-pulse transition-all duration-1000"
        style={{
          background: currentTheme === 'custom' 
            ? `radial-gradient(circle at 80% 80%, ${themes.custom.rgb(...themes.custom.customColors.secondary, 0.2)}, transparent 50%)`
            : 'radial-gradient(circle at 80% 80%, rgba(255,0,255,0.2), transparent 50%)'
        }}
      ></div>
      <div 
        className="absolute inset-0 animate-pulse transition-all duration-1000"
        style={{
          background: currentTheme === 'custom' 
            ? `radial-gradient(circle at 50% 50%, ${themes.custom.rgb(...themes.custom.customColors.accent, 0.1)}, transparent 70%)`
            : 'radial-gradient(circle at 50% 50%, rgba(0,60,255,0.1), transparent 70%)'
        }}
      ></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)],
              y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      {/* Animated Orbs */}
      <motion.div
        animate={{
          x: [0, 25, -25, 0],
          y: [0, -20, 20, 0],
          rotateZ: [0, 360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[15%] left-[5%] w-[200px] h-[200px] md:w-[260px] md:h-[260px] rounded-full bg-gradient-to-br ${themes[currentTheme].orb1} blur-[100px] md:blur-[130px] opacity-40 transition-all duration-1000`}
      />
      <motion.div
        animate={{
          x: [0, -20, 20, 0],
          y: [0, 30, -30, 0],
          rotateZ: [0, -360],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-[10%] right-[5%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-full bg-gradient-to-br ${themes[currentTheme].orb2} blur-[120px] md:blur-[150px] opacity-30 transition-all duration-1000`}
      />

      {/* Theme Selector */}
      {showThemes && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute top-6 left-4 sm:left-48 z-20 glass-effect rounded-xl p-3 sm:p-4 border border-white/20 max-w-xs"
        >
          <h3 className="text-white font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Choose Theme</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(themes).map(([key, theme]) => (
              <motion.button
                key={key}
                onClick={() => {
                  setCurrentTheme(key);
                  setShowThemes(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-10 sm:w-16 sm:h-12 rounded-lg bg-gradient-to-br ${theme.bg} border-2 transition-all duration-300 ${
                  currentTheme === key ? 'border-white/50' : 'border-white/20'
                }`}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
              >
                <div className={`w-full h-full rounded-md bg-gradient-to-br ${theme.orb1} opacity-60`}></div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-col sm:flex-col space-y-2">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,0,120,0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="glass-effect px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-pink-500/30 
          bg-gradient-to-r from-pink-500/20 to-red-500/20 
          font-semibold text-xs sm:text-sm text-pink-300 
          hover:from-pink-500/30 hover:to-red-500/30 transition-all duration-300"
        >
          <span className="flex items-center space-x-1 sm:space-x-2">
            <span>🚪</span>
            <span className="hidden sm:inline">Logout</span>
          </span>
        </motion.button>
        
        <motion.button
          onClick={() => navigate("/customization")}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,255,255,0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="glass-effect px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-cyan-500/30 
          bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
          font-semibold text-xs sm:text-sm text-cyan-300 
          hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
        >
          <span className="flex items-center space-x-1 sm:space-x-2">
            <span>⚙️</span>
            <span className="hidden sm:inline">Customize</span>
          </span>
        </motion.button>
        
        <motion.button
          onClick={() => setShowThemes(!showThemes)}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168,85,247,0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="glass-effect px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-purple-500/30 
          bg-gradient-to-r from-purple-500/20 to-violet-500/20 
          font-semibold text-xs sm:text-sm text-purple-300 
          hover:from-purple-500/30 hover:to-violet-500/30 transition-all duration-300"
        >
          <span className="flex items-center space-x-1 sm:space-x-2">
            <span>🎨</span>
            <span className="hidden sm:inline">Themes</span>
          </span>
        </motion.button>
      </div>
      {/* Assistant Image Section */}
      <div className="w-full lg:w-1/3 h-64 sm:h-80 lg:h-full relative overflow-hidden z-10">
        <motion.div
          className="assistant-container h-full flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {selectedImage ? (
            <motion.img
              src={selectedImage}
              alt="Assistant"
              className="assistant-image w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-2xl"
              animate={{
                y: [0, -10, 0],
                rotateY: [0, 5, 0],
                boxShadow: [
                  "0 0 40px rgba(59,130,246,0.3)",
                  "0 0 60px rgba(147,51,234,0.4)",
                  "0 0 40px rgba(59,130,246,0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-white/10">
              <span className="text-white/60 text-lg sm:text-xl text-center px-4">No Assistant Selected</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 min-h-0">
        <div className="w-full max-w-4xl lg:max-w-xl">
          <AssistantHeader name={assistantName} />

          <motion.div
            className="w-full mt-4 sm:mt-6 bg-gray-800/60 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ChatWindow chats={chats} />
            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow bg-gray-700 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl outline-none placeholder-gray-400 text-sm sm:text-base touch-manipulation"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendText(typedText);
                    setTypedText("");
                  }
                }}
                autoComplete="off"
                autoCapitalize="sentences"
                autoCorrect="on"
              />
              <button
                onClick={() => {
                  sendText(typedText);
                  setTypedText("");
                }}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium"
              >
                Send
              </button>
            </div>
          </motion.div>

          <div className="mt-4 sm:mt-6 flex justify-center">
            <VoiceButton
              isListening={isListening}
              onStart={startListening}
              onStop={stopListening}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;



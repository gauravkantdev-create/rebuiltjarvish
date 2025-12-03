import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export const userDataContext = createContext();

const UserContext = ({ children }) => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize from localStorage
  const [frontendImage, setFrontendImage] = useState(() => {
    const stored = localStorage.getItem('frontendImage') || null;
    console.log("🔄 Initial frontendImage from localStorage:", stored);
    return stored;
  });
  const [backendImage, setBackendImage] = useState(() => {
    const stored = localStorage.getItem('backendImage') || null;
    console.log("🔄 Initial backendImage from localStorage:", stored);
    return stored;
  });
  const [selectedImage, setSelectedImage] = useState(() => {
    const stored = localStorage.getItem('selectedImage') || null;
    console.log("🔄 Initial selectedImage from localStorage:", stored);
    return stored;
  });
  const [assistantName, setAssistantName] = useState(() => {
    const stored = localStorage.getItem('assistantName') || "";
    console.log("🔄 Initial assistantName from localStorage:", stored);
    return stored;
  });

  console.log("🚀 UserContext initialized with:", {
    hasUserData: !!userData,
    assistantName,
    hasSelectedImage: !!selectedImage,
    frontendImage,
    backendImage
  });

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/current`);
      const user = result.data.user;
      setUserData(user);
      
      // Update assistant name from database
      if (user.assistantName) {
        setAssistantName(user.assistantName);
        localStorage.setItem('assistantName', user.assistantName);
        console.log("✅ Loaded assistant name from DB:", user.assistantName);
      } else {
        console.log("ℹ️ No assistant name found in DB");
      }
      
      // Update selected image from database
      if (user.assistantImage) {
        setSelectedImage(user.assistantImage);
        localStorage.setItem('selectedImage', user.assistantImage);
        console.log("✅ Loaded assistant image from DB:", user.assistantImage);
      } else {
        console.log("ℹ️ No assistant image found in DB");
      }
      
      console.log("✅ Current User Data:", user);
      console.log("✅ LocalStorage State:", {
        assistantName: localStorage.getItem('assistantName'),
        selectedImage: localStorage.getItem('selectedImage')
      });
    } catch (error) {
      console.error("❌ Error fetching current user data:", error);
      if (error.code === "ERR_NETWORK" || error.code === "ERR_CONNECTION_REFUSED") {
        console.warn("⚠️ Backend server is not running on port 5000");
      }
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCurrentUser();
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Forcing loading to false after timeout');
      setLoading(false);
    }, 2000); // Reduced to 2 second timeout
    
    return () => clearTimeout(timeout);
  }, []);

  // Enhanced setters with localStorage
  const setFrontendImageWithStorage = (value) => {
    setFrontendImage(value);
    if (value) localStorage.setItem('frontendImage', value);
    else localStorage.removeItem('frontendImage');
  };

  const setSelectedImageWithStorage = (value) => {
    setSelectedImage(value);
    if (value) localStorage.setItem('selectedImage', value);
    else localStorage.removeItem('selectedImage');
  };

  const setAssistantNameWithStorage = (value) => {
    setAssistantName(value);
    if (value) localStorage.setItem('assistantName', value);
    else localStorage.removeItem('assistantName');
  };

  const value = {
    serverUrl,
    userData,
    setUserData,
    handleCurrentUser,
    loading,
    frontendImage,
    setFrontendImage: setFrontendImageWithStorage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage: setSelectedImageWithStorage,
    assistantName,
    setAssistantName: setAssistantNameWithStorage,
  };

  return <userDataContext.Provider value={value}>{children}</userDataContext.Provider>;
};

export default UserContext;

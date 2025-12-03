import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import bg from "../assets/authBg.png";
import { userDataContext } from "../Context/UserContext";
import axios from "axios";
import { motion } from "framer-motion";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Access context and navigation
  const { serverUrl, setUserData, setSelectedImage, setAssistantName, setFrontendImage } = useContext(userDataContext);
  const navigate = useNavigate();

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle signup logic
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        formData,
        { withCredentials: true } // allow cookies for authentication
      );

      alert(res.data.message || "Registration successful!");
      setUserData(res.data.user); // save user info in context
      
      // Clear any previous customization data for new user
      setSelectedImage(null);
      setAssistantName("");
      setFrontendImage(null);

      // ✅ Redirect only after success
      navigate("/customization");
    } catch (error) {
      console.error("Signup Error:", error);
      if (error.code === 'ERR_NETWORK') {
        alert('Backend server is not running! Please start the backend server on port 5000.');
      } else {
        alert(error.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/90" />
      
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          x: [0, -100, 100, 0],
          y: [0, 50, -50, 0],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-10 w-36 h-36 bg-green-500/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [0, -60, 60, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-10 w-44 h-44 bg-pink-500/20 rounded-full blur-xl"
      />

      {/* Sign Up Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <div className="glass-effect rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Create Account 🚀
            </h1>
            <p className="text-slate-300 text-sm sm:text-base">
              Join us and create your AI assistant
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onSubmit={handleSignUp}
            className="space-y-6"
          >
            {/* Full Name Input */}
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="input-field w-full h-12 px-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <label className="absolute -top-2 left-3 bg-slate-800 px-2 text-xs text-slate-300 font-medium">
                Full Name
              </label>
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="input-field w-full h-12 px-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <label className="absolute -top-2 left-3 bg-slate-800 px-2 text-xs text-slate-300 font-medium">
                Email Address
              </label>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className="input-field w-full h-12 px-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <label className="absolute -top-2 left-3 bg-slate-800 px-2 text-xs text-slate-300 font-medium">
                Password
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-slate-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-green-500/25"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-slate-300 text-sm">
              Already have an account?{" "}
              <Link 
                to="/signin" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;

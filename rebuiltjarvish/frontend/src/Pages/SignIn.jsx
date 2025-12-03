import React, { useState, useContext } from 'react';
import bg from '../assets/authBg.png';
import axios from 'axios';
import { userDataContext } from '../Context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Access context & navigation
  const { serverUrl, setUserData, setSelectedImage, setAssistantName } = useContext(userDataContext);
  const navigate = useNavigate();

  // ✅ Load user's customization data from database
  const loadUserCustomization = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/current`);
      const user = result.data.user;
      
      // Load assistant name from database
      if (user.assistantName) {
        setAssistantName(user.assistantName);
        localStorage.setItem('assistantName', user.assistantName);
      }
      
      // Load assistant image from database
      if (user.assistantImage) {
        setSelectedImage(user.assistantImage);
        localStorage.setItem('selectedImage', user.assistantImage);
      }
      
      console.log("✅ Loaded user customization:", { assistantName: user.assistantName, assistantImage: user.assistantImage });
    } catch (error) {
      console.error("❌ Error loading customization:", error);
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // ✅ Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${serverUrl}/api/auth/login`, formData, {
        withCredentials: true,
      });

      // ✅ If backend returns user data
      if (res.data.user) {
        setUserData(res.data.user);
      }

      alert(res.data.message || 'Login successful!');
      setFormData({ email: '', password: '' });

      // ✅ Load user's existing customization data
      await loadUserCustomization();

      // ✅ Check if user has completed customization and navigate accordingly
      const user = res.data.user;
      if (user.assistantName && user.assistantImage) {
        navigate('/'); // Go to home if customization is complete
      } else {
        navigate('/customization'); // Go to customization if not complete
      }
    } catch (err) {
      console.error('Login Error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Invalid email or password');
      } else {
        setError('Something went wrong. Please try again.');
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
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 80, 0],
          y: [0, 60, -60, 0],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"
      />

      {/* Login Card */}
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
              Welcome Back 👋
            </h1>
            <p className="text-slate-300 text-sm sm:text-base">
              Sign in to continue to your AI assistant
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
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
                placeholder="Enter your password"
                className="input-field w-full h-12 px-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <label className="absolute -top-2 left-3 bg-slate-800 px-2 text-xs text-slate-300 font-medium">
                Password
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-slate-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
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
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign Up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;

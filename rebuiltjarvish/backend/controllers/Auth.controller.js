// Controllers/Auth.controller.js
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import geminiResponse from "../routes/Gemini.js";

// ==========================
// GET CURRENT DATE TIME FUNCTION
// ==========================
export const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0],
    month: now.toLocaleDateString('en-US', { month: 'long' }),
    fullDateTime: now.toISOString().replace('T', ' ').split('.')[0],
    dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' })
  };
};

// ==========================
// SIGNUP CONTROLLER
// ==========================
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (!password || password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      assistantName: "",
      assistantImage: "",
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==========================
// LOGIN CONTROLLER
// ==========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==========================
// LOGOUT CONTROLLER
// ==========================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==========================
// CURRENT USER CONTROLLER
// ==========================
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("🔍 getCurrentUser - userId:", userId);

    if (!userId)
      return res.status(401).json({ message: "Unauthorized: No user ID found" });

    const user = await User.findById(userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    console.log("👤 getCurrentUser - Found user:", {
      id: user._id,
      name: user.name,
      email: user.email,
      assistantName: user.assistantName
    });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("❌ Current user error:", error);
    res.status(500).json({ message: "Server error while fetching user" });
  }
};

// ==========================
// ASK TO ASSISTANT CONTROLLER
// ==========================
export const askToAssistant = async (req, res) => {
  try {
    console.log("🔍 Request userId:", req.userId);
    
    // Validate user authentication
    if (!req.userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: No user ID found" 
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("👤 Found user:", {
      id: user._id,
      name: user.name,
      email: user.email,
      assistantName: user.assistantName
    });

    // Validate prompt from request body
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: "Valid prompt is required" 
      });
    }

    // Get current date/time info
    const currentDateTime = getCurrentDateTime();
    
    // Use dynamic personalization with current date context
    const assistantName = user.assistantName?.trim() || "Assistant";
    const authorName = user.name?.trim() || "User";
    
    console.log("🤖 Using names - Assistant:", assistantName, "User:", authorName);
    console.log("📝 Original prompt:", prompt);
    
    // Create enhanced prompt with context
    const enhancedPrompt = `You are ${assistantName}. User: ${authorName}. Today: ${currentDateTime.dayOfWeek}, ${currentDateTime.date} ${currentDateTime.time}. Question: ${prompt}`;

    console.log("🚀 Sending enhanced prompt to Gemini:", enhancedPrompt);

    // Pass enhanced prompt to Gemini
    const response = await geminiResponse(enhancedPrompt);

    if (!response || response.trim() === '') {
      throw new Error('Empty response from Gemini API');
    }

    console.log("✅ Received response from Gemini:", response.substring(0, 100) + "...");

    return res.status(200).json({
      success: true,
      assistantName,
      response,
    });
  } catch (error) {
    console.error("❌ askToAssistant error details:");
    console.error("- Error Message:", error.message);
    console.error("- Error Stack:", error.stack);
    console.error("- Request Body:", req.body);
    console.error("- User ID:", req.userId);
    
    // Send detailed error response
    return res.status(500).json({ 
      success: false, 
      message: "Error communicating with assistant",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ==========================
// UPDATE ASSISTANT CONTROLLER
// ==========================
export const updateAssistant = async (req, res) => {
  try {
    console.log("🔍 updateAssistant - userId:", req.userId);
    console.log("🔍 updateAssistant - body:", req.body);
    
    const { assistantName, assistantImage } = req.body;

    if (!assistantName || !assistantName.trim()) {
      return res.status(400).json({ message: "Assistant name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        assistantName: assistantName.trim(), 
        assistantImage: assistantImage || "" 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Assistant updated:", {
      userId: user._id,
      assistantName: user.assistantName,
      assistantImage: user.assistantImage
    });

    return res.status(200).json({
      success: true,
      message: "Assistant updated successfully",
      assistant: {
        name: user.assistantName,
        image: user.assistantImage,
        createdBy: user.name,
      },
    });
  } catch (error) {
    console.error("❌ Update Assistant error:", error);
    res.status(500).json({ message: "Failed to update assistant" });
  }
};

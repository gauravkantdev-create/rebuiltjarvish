import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRoutes from "./routes/Users.Routes.js";
import AuthRoutes from "./routes/Auth.Routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import geminiResponse from "./routes/Gemini.js";

dotenv.config();

const app = express();

// ✅ Middleware
// Dynamic CORS: allow common localhost ports and configured frontend origin
app.use(cors({
  origin: function(origin, callback) {
    // Allow non-browser requests (Postman, server-to-server) where origin is undefined
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return callback(null, true);
      }
    } catch (e) {
      // if parsing fails, deny
    }
    // allow specific known origins (in case of remote dev servers)
    const allowed = ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];
    if (allowed.indexOf(origin) !== -1) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json()); // Parse JSON request body
app.use(cookieParser()); // Parse cookies

// ✅ Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Request Body:", req.body);
  next();
});

// ✅ Connect to Database
connectDb()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// ✅ Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", AuthRoutes);

// ✅ Gemini AI Route
// app.get("/api/gemini", async (req, res) => {
//   try {
//     const prompt = req.query.prompt || "Hello, World!";
//     console.log("🧠 Gemini Prompt:", prompt);

//     const response = await geminiResponse(prompt);

//     res.status(200).json({
//       message: "✅ Gemini response generated successfully!",
//       prompt,
//       response,
//     });
//   } catch (error) {
//     console.error("❌ Gemini API Error:", error.message);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch Gemini response.", error: error.message });
//   }
// });

// ✅ Test Gemini API endpoint (no auth required for testing)
app.get("/test-gemini", async (req, res) => {
  const prompt = req.query.prompt || "What is JavaScript?";
  
  try {
    console.log("🧠 Testing Gemini with prompt:", prompt);
    const response = await geminiResponse(prompt);
    
    res.status(200).json({
      success: true,
      prompt,
      response: response,
    });
  } catch (error) {
    console.error("❌ Test Gemini Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to test Gemini API.", 
      error: error.message 
    });
  }
});

// ✅ Root route with Gemini support
app.get("/", async (req, res) => {
  const prompt = req.query.prompt;
  
  if (prompt) {
    try {
      console.log("🧠 Gemini Prompt:", prompt);
      const response = await geminiResponse(prompt);
      
      res.status(200).json({
        success: true,
        message: "✅ Gemini response generated successfully!",
        prompt,
        response: response,
      });
    } catch (error) {
      console.error("❌ Gemini API Error:", error.message);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch Gemini response.", 
        error: error.message 
      });
    }
  } else {
    res.send("🚀 Backend is running successfully... Use /test-gemini?prompt=your+question to test the assistant");
  }
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app
  .listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server started on http://localhost:${PORT}`);
    console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("❌ Server failed to start:", err.message);
  });

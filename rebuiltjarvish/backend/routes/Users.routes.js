import express from "express";
import { updateAssistant } from "../controllers/User.Controllers.js";
import isAuth from "../middlewares/IsAuth.js";
import upload from "../middlewares/Multer.js";

const userRouter = express.Router();

// User-specific routes
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);

export default userRouter;
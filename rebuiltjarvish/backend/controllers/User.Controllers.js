// Controllers/User.controller.js
import User from "../models/User.model.js";
import uploadOnCloudinary from "../config/Cloudinary.js";

export const updateAssistant = async (req, res) => {
  try {
    const userId = req.userId;
    const { assistantName } = req.body;

    if (!userId)
      return res.status(401).json({ message: "Unauthorized" });

    if (!assistantName && !req.file)
      return res.status(400).json({ message: "Provide assistant name or image" });

    let assistantImage;

    // ✅ Upload to Cloudinary if image file provided
    if (req.file) {
      try {
        const uploaded = await uploadOnCloudinary(req.file.path);

        // Explicitly validate upload response
        if (!uploaded || !uploaded.url) {
          console.error("❌ Cloudinary upload returned unexpected response:", uploaded);
          return res.status(500).json({ message: "Failed to upload image" });
        }

        assistantImage = uploaded.url;
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(assistantName && { assistantName }),
        ...(assistantImage && { assistantImage }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "Assistant updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Assistant update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

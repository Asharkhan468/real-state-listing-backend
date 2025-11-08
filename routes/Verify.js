import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const route = express.Router();

// VERIFY TOKEN ROUTE
route.get("/verifyToken", (req, res) => {
  try {
    const token = req.cookies.token; // cookie se token nikaal lo

    if (!token) {
      return res.status(401).json({ valid: false, message: "No token found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ valid: false, message: "Invalid token" });
      }
      return res.status(200).json({ valid: true, user: decoded });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ valid: false, message: "Server error" });
  }
});

export default route;

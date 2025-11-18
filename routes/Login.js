import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const route = express.Router();
dotenv.config();

// LOGIN ROUTE
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if email & password match admin
    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ message: "You are not a authorize user!" });
    }

    // Generate token for admin
    const token = jwt.sign(
      { email: adminEmail, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...(isProduction && { domain: ".vercel.app" }),
    });

    return res.status(200).json({
      message: "Login successful!",
      user: {
        email: adminEmail,
        role: "admin",
        token,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error while logging in!" });
  }
});

export default route;

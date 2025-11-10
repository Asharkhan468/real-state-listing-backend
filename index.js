import express from "express";
import mongoose from "mongoose";
import login from "./routes/Login.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import createPost from "./routes/CreatePost.js";
import allPost from "./routes/GetPosts.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://real-state-listings-beta.vercel.app",
    ],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", login);
app.use("/api/v1", createPost);
app.use("/api/v1", allPost);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

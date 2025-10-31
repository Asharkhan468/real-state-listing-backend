import express from "express";
import Post from "../models/Post.js";

const route = express.Router();

route.get("/allPost", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); 
    res.status(200).json({
      message: "All posts fetched successfully!",
      total: posts.length,
      posts,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Error while fetching posts!" });
  }
});

export default route;

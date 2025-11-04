import express from "express";
import Post from "../models/Post.js";
import upload from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

const route = express.Router();

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return reject(new Error("No file buffer received"));

    const stream = cloudinary.uploader.upload_stream(
      { folder: "posts" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// ✏️ UPDATE POST

route.post("/createPost", upload.single("image"), async (req, res) => {
  try {
    const { title, price, beds, baths, area, description, type, location } =
      req.body;

    // 🔹 Convert numeric fields to Number safely
    const convertedData = {
      title,
      price: Number(price),
      beds: Number(beds),
      baths: Number(baths),
      area: Number(area),
      location,
      description,
      type,
    };

    // 🔹 Upload image if file is provided
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    // 🔹 Create and save new post
    const newPost = new Post({
      ...convertedData,
      image: imageUrl,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully!",
      post: newPost,
      success: true,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({
      message: "Error while creating post!",
    });
  }
});

route.put("/updatePost/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, price, beds, baths, area, description, badge } =
      req.body;

    const existingPost = await Post.findById(id);
    if (!existingPost)
      return res.status(404).json({ message: "Post not found!" });

    let imageUrl = existingPost.image;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    existingPost.title = title || existingPost.title;
    existingPost.location = location || existingPost.location;
    existingPost.price = price || existingPost.price;
    existingPost.beds = beds || existingPost.beds;
    existingPost.baths = baths || existingPost.baths;
    existingPost.area = area || existingPost.area;
    existingPost.description = description || existingPost.description;
    existingPost.badge = badge || existingPost.badge;
    existingPost.image = imageUrl;

    await existingPost.save();
    res
      .status(200)
      .json({ message: "Post updated successfully!", post: existingPost });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Error while updating post!" });
  }
});

route.delete("/deletePost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found!" });

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Error while deleting post!" });
  }
});

export default route;

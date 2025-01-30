import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import fs from 'fs';
import multer from 'multer';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Your Password Must atleast be of 6 character" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already Exists" });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new User
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate Jwt Token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid Details" });
    }
  } catch (error) {
    console.log({ "Error in Signup Controller": error });
    res.status(500).json({ message: "Internal Service Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Check Your Email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Check Your Password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login Controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    console.log("Error in Logged Controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const storage = multer.memoryStorage();
const upload = multer({ storage });

export const updateProfile = async (req, res) => {
  try {
    upload.single('profilePic')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Profile pic is required' });
      }

      const userId = req.user._id;
      
      const uploadResponse = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error uploading to Cloudinary' });
        }

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePic: result.secure_url },
          { new: true }
        );

        res.status(200).json(updatedUser);
      }).end(req.file.buffer);
    });
  } catch (error) {
    console.error('Error in update profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
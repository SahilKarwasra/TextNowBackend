import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import { getReceiverSocketId, io } from "../lib/socket.js";
import { getGeminiAIResponse } from "../lib/googleGenerativeAIClient.js";

export const getUsersForSiebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // 1. Get all users except logged-in user
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } })
                               .select("-password");

    // 2. For each user, find the last message in the conversation
    const usersWithLastMessage = await Promise.all(
      allUsers.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId }
          ]
        }).sort({ createdAt: -1 });

        return {
          ...user.toObject(),  // Ensure serialization
          lastMessage: lastMessage ? {
            text: lastMessage.text,
            image: lastMessage.image,
            createdAt: lastMessage.createdAt,
            isSeen: lastMessage.isSeen
          } : null
        };
      })
    );

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.log("Error in getting users", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getMessages = async (req, res) => {
  try {
    console.log("getMessages function called");

    const { id: userToChatId } = req.params;

    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    // console.log("messages found:", messages); // Log the messages

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages Controller:", error.message); // Log error message
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Realtime Updation using Socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const generateText = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await getGeminiAIResponse(message);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in Generating Text:", error);
    res.status(500).json({ error: "Failed to generate text" });
  }
};

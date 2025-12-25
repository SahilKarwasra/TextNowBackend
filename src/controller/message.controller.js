import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import admin from "../lib/firebase.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { getGeminiAIResponse } from "../lib/googleGenerativeAIClient.js";

export const getUsersForSiebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const usersWithLastMessage = await getSidebarDataForUser(loggedInUserId);
    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.log("Error in getting users", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSidebarDataForUser = async (userId) => {
  const allUsers = await User.find({ _id: { $ne: userId } }).select("-password");

  const usersWithLastMessage = await Promise.all(
    allUsers.map(async (user) => {
      const lastMessage = await Message.findOne({
        $or: [
          { senderId: userId, receiverId: user._id },
          { senderId: user._id, receiverId: userId }
        ]
      }).sort({ createdAt: -1 });

      return {
        ...user.toObject(),
        lastMessage: lastMessage ? {
          text: lastMessage.text,
          image: lastMessage.image,
          createdAt: lastMessage.createdAt,
          isSeen: lastMessage.isSeen
        } : null
      };
    })
  );

  return usersWithLastMessage;
};



export const getMessages = async (req, res) => {
  try {

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

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      console.log("🟢 Receiver online → sent via Socket.IO");
    }

    // 🔔 PUSH NOTIFICATION LOGIC
    if (!receiverSocketId) {
      console.log("🔴 Receiver offline → trying FCM push");

      const receiver = await User.findById(receiverId);

      if (!receiver?.fcmTokens?.length) {
        console.log("⚠️ No FCM tokens found for receiver");
      }

      if (receiver?.fcmTokens?.length) {
        console.log("📨 Sending FCM to tokens:", receiver.fcmTokens.length);

        const payload = {
          notification: {
            title: "New message",
            body: text ? text : "📷 Image",
          },
          data: {
            senderId: senderId.toString(),
            receiverId: receiverId.toString(),
            messageId: newMessage._id.toString(),
          },
        };

        try {
          const response = await admin.messaging().sendEachForMulticast({
            tokens: receiver.fcmTokens,
            ...payload,
          });

          console.log("✅ FCM response:", {
            successCount: response.successCount,
            failureCount: response.failureCount,
          });

          response.responses.forEach((r, index) => {
            if (!r.success) {
              console.log("❌ Invalid token removed at index:", index);
              receiver.fcmTokens.splice(index, 1);
            }
          });

          await receiver.save();
        } catch (err) {
          console.log("❌ FCM push error:", err.message);
        }
      }
    }

    const usersToUpdate = [receiverId, senderId];

    for (const userId of usersToUpdate) {
      const socketId = getReceiverSocketId(userId);
      if (!socketId) continue;

      const usersWithLastMessage = await getSidebarDataForUser(userId);
      io.to(socketId).emit("sidebarUpdate", usersWithLastMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("❌ Error in sendMessage Controller:", error.message);
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

export const saveFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user._id;

    if (!fcmToken) {
      return res.status(400).json({ message: "FCM token required" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { fcmTokens: fcmToken } }
    );

    res.status(200).json({ message: "FCM token saved" });
  } catch (error) {
    console.log("FCM token save error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSiebar, sendMessage, generateText, saveFcmToken } from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSiebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id",protectRoute,sendMessage);

router.post("/generate-text", generateText);
router.post("/save-fcm-token", protectRoute, saveFcmToken);

export default router;
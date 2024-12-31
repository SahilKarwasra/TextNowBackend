import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSiebar, sendMessage } from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSiebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id",protectRoute,sendMessage);

export default router;
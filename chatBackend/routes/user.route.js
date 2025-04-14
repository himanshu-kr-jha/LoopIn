import express from "express";
import { getCorrentChatters, getUserBySearch, userLogOut } from "../controllers/user.controller.js";
import isLogin from "../middleware/isLogin.js";
const router = express.Router();

router.post("/logout", userLogOut);
router.get("/search", isLogin, getUserBySearch);

router.get("/currentchatters", isLogin, getCorrentChatters);

export default router;

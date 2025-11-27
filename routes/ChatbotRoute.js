import { Router } from "express";
import { chatbotController } from "../controllers/ChatbotController.js";

const router = Router();

router.post("/", chatbotController.handleChat);
router.get("/greet", chatbotController.greet);


export default router;

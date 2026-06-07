import { Router } from "express";
import { analyzeIssue } from "../controllers/ai.controller";

const router = Router();

router.post("/analyze/:issueId", analyzeIssue);

export default router;

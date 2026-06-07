import { Router } from "express";
import {
  createDiscussion,
  getDiscussionsByIssue,
} from "../controllers/discussion.controller";

const router = Router();

router.post("/", createDiscussion);
router.get("/issue/:issueId", getDiscussionsByIssue);

export default router;

import { Router } from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
} from "../controllers/issue.controller";

const router = Router();

router.post("/", createIssue);
router.get("/", getAllIssues);
router.patch("/:id/status", updateIssueStatus);
router.get("/:id", getIssueById);

export default router;

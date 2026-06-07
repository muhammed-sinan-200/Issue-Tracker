import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import aiRoutes from "./modules/ai/routes/ai.route";
import discussionRoutes from "./modules/discussions/routes/discussion.route";
import issueRoutes from "./modules/issues/routes/issue.route";
import userRoutes from "./modules/users/routes/user.route";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
// const PORT = process.env.PORT || 3001;

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("PORT is not defined by environment (Render)");
}

app.use(cors());
app.use(express.json());

app.use("/api/issues", issueRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

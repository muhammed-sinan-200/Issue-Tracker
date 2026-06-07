import { Request, Response } from "express";
import * as userService from "../services/user.service";

export async function getAllUsers(_req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

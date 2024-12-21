import { Request, Response } from "express";
import { User } from "../models";
import { uploadService } from "../services/uploadService";
import { AppError } from "../middlewares/errorHandler";
import cacheService from "../services/cacheService";

export const userController = {
  async updateProfile(req: Request, res: Response) {
    const userId = req.user!.id;
    const { name } = req.body;
    const avatar = req.file;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (avatar) {
      const avatarUrl = await uploadService.uploadToS3(avatar);
      user.avatarUrl = avatarUrl;
    }

    if (name) {
      user.name = name;
    }

    await user.save();
    await cacheService.delete(`user:${userId}`);

    return res.json({
      header: { status: "success" },
      body: { data: user },
    });
  },

  async getProfile(req: Request, res: Response) {
    const userId = req.user!.id;

    const cachedUser = await cacheService.get(`user:${userId}`);
    if (cachedUser) {
      return res.json({
        header: { status: "success" },
        body: { data: cachedUser },
      });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await cacheService.set(`user:${userId}`, user, 3600);

    return res.json({
      header: { status: "success" },
      body: { data: user },
    });
  },
};

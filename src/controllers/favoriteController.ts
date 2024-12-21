import { Request, Response } from "express";
import { Favorite, HandcupInfo } from "../models";
import { AppError } from "../middlewares/errorHandler";

export const favoriteController = {
  async createFavorite(req: Request, res: Response) {
    const { placeId } = req.body;
    const userId = req.user!.id;

    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({
      where: { userId, placeId },
    });

    if (existingFavorite) {
      throw new AppError(400, "Place already in favorites");
    }

    // Check if place exists
    const place = await HandcupInfo.findOne({
      where: { placeId },
    });

    if (!place) {
      throw new AppError(404, "Place not found");
    }

    const favorite = await Favorite.create({
      userId,
      placeId,
      createTime: new Date(),
      updateTime: new Date(),
    });

    return res.status(201).json({
      header: { status: "success" },
      body: { data: favorite },
    });
  },

  async getFavorites(req: Request, res: Response) {
    const userId = req.user!.id;

    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: HandcupInfo,
          attributes: ["name", "rating", "imageUrl", "views"],
        },
      ],
      order: [["createTime", "DESC"]],
    });

    return res.json({
      header: { status: "success" },
      body: { data: favorites },
    });
  },

  async deleteFavorite(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const favorite = await Favorite.findOne({
      where: { id, userId },
    });

    if (!favorite) {
      throw new AppError(404, "Favorite not found");
    }

    await favorite.destroy();

    return res.json({
      header: { status: "success" },
      body: { data: { message: "Favorite deleted successfully" } },
    });
  },
};

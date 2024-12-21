import { Request, Response } from "express";
import { Rating, HandcupInfo } from "../models";
import { AppError } from "../middlewares/errorHandler";
import { sequelize } from "../config/database";

export const ratingController = {
  async createRating(req: Request, res: Response) {
    const { placeId, score, comment } = req.body;
    const userId = req.user!.id;

    const transaction = await sequelize.transaction();

    try {
      // Check if user already rated this place
      const existingRating = await Rating.findOne({
        where: { userId, placeId },
      });

      if (existingRating) {
        throw new AppError(400, "You have already rated this place");
      }

      // Create rating
      const rating = await Rating.create(
        {
          userId,
          placeId,
          score,
          comment,
        },
        { transaction }
      );

      // Update place rating
      const place = await HandcupInfo.findOne({
        where: { placeId },
      });

      if (!place) {
        throw new AppError(404, "Place not found");
      }

      const ratings = await Rating.findAll({
        where: { placeId },
        attributes: ["score"],
      });

      const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
      const averageRating = totalScore / ratings.length;

      await place.update(
        {
          rating: averageRating,
          ratingsTotal: ratings.length,
        },
        { transaction }
      );

      await transaction.commit();

      return res.status(201).json({
        header: { status: "success" },
        body: { data: rating },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async getRatings(req: Request, res: Response) {
    const { placeId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const ratings = await Rating.findAndCountAll({
      where: { placeId },
      include: [
        {
          model: User,
          attributes: ["name", "avatarUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json({
      header: { status: "success" },
      body: {
        data: {
          ratings: ratings.rows,
          total: ratings.count,
          page,
          totalPages: Math.ceil(ratings.count / limit),
        },
      },
    });
  },
};

import { Request, Response } from "express";
import { SearchHistory } from "../models";

export const searchHistoryController = {
  async getSearchHistory(req: Request, res: Response) {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const history = await SearchHistory.findAndCountAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json({
      header: { status: "success" },
      body: {
        data: {
          history: history.rows,
          total: history.count,
          page,
          totalPages: Math.ceil(history.count / limit),
        },
      },
    });
  },

  async clearSearchHistory(req: Request, res: Response) {
    const userId = req.user!.id;

    await SearchHistory.destroy({
      where: { userId },
    });

    return res.json({
      header: { status: "success" },
      body: {
        data: { message: "Search history cleared successfully" },
      },
    });
  },
};

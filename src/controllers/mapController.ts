import { Request, Response } from "express";
import { mapService } from "../services/mapService";
import { AppError } from "../middlewares/errorHandler";
import { HandcupInfo, SearchHistory } from "../models";
import cacheService from "../services/cacheService";

export const mapController = {
  async searchNearby(req: Request, res: Response) {
    const { latitude, longitude, radius, keyword } = req.body;
    const userId = req.user!.id;

    // 記錄搜索歷史
    await SearchHistory.create({
      userId,
      keyword,
      latitude,
      longitude,
      radius,
      createdAt: new Date(),
    });

    // Try to get from cache first
    const cacheKey = `nearby:${latitude}:${longitude}:${radius}:${keyword}`;
    const cachedResult = await cacheService.get(cacheKey);

    if (cachedResult) {
      return res.json({
        header: { status: "success" },
        body: { data: cachedResult },
      });
    }

    const places = await mapService.searchNearbyPlaces({
      latitude,
      longitude,
      radius,
      keyword,
    });

    // Cache the result for 5 minutes
    await cacheService.set(cacheKey, places, 300);

    return res.json({
      header: { status: "success" },
      body: { data: places },
    });
  },

  async getPlaceDetails(req: Request, res: Response) {
    const { placeId, language } = req.params;

    const cacheKey = `place:${placeId}:${language}`;
    const cachedResult = await cacheService.get(cacheKey);

    if (cachedResult) {
      return res.json({
        header: { status: "success" },
        body: { data: cachedResult },
      });
    }

    const placeDetails = await mapService.getPlaceDetails(placeId, language);

    // Cache the result for 1 hour
    await cacheService.set(cacheKey, placeDetails, 3600);

    return res.json({
      header: { status: "success" },
      body: { data: placeDetails },
    });
  },

  async updateViews(req: Request, res: Response) {
    const { placeId } = req.params;

    const handcupInfo = await HandcupInfo.findOne({
      where: { placeId },
    });

    if (!handcupInfo) {
      throw new AppError(404, "Place not found");
    }

    await handcupInfo.increment("views");

    return res.json({
      header: { status: "success" },
      body: { data: handcupInfo },
    });
  },
};

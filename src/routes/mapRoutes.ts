import { Router } from "express";
import { mapController } from "../controllers/mapController";
import { verifyToken } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { searchNearbySchema } from "../validators/mapValidators";
import { searchLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.post(
  "/nearby",
  verifyToken,
  searchLimiter,
  validateRequest(searchNearbySchema),
  mapController.searchNearby
);

router.get(
  "/details/:placeId/:language",
  verifyToken,
  mapController.getPlaceDetails
);

export default router;

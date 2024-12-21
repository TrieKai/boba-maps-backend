import { Router } from "express";
import { favoriteController } from "../controllers/favoriteController";
import { verifyToken } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { createFavoriteSchema } from "../validators/favoriteValidators";

const router = Router();

router.use(verifyToken);

router.post(
  "/",
  validateRequest(createFavoriteSchema),
  favoriteController.createFavorite
);
router.get("/", favoriteController.getFavorites);
router.delete("/:id", favoriteController.deleteFavorite);

export default router;

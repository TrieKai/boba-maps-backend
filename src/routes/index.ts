import { Router } from "express";
import authRoutes from "./authRoutes";
import mapRoutes from "./mapRoutes";
import favoriteRoutes from "./favoriteRoutes";
import searchHistoryRoutes from "./searchHistoryRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/map", mapRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/search-history", searchHistoryRoutes);

export default router;

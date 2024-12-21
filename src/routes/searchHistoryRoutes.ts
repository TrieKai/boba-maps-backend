import { Router } from "express";
import { searchHistoryController } from "../controllers/searchHistoryController";
import { verifyToken } from "../middlewares/auth";

const router = Router();

router.use(verifyToken);

router.get("/", searchHistoryController.getSearchHistory);
router.delete("/", searchHistoryController.clearSearchHistory);

export default router;

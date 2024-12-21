import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from "../validators/authValidators";
import { verifyToken } from "../middlewares/auth";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authController.resetPassword
);
router.post("/verify-token", verifyToken, (req, res) => {
  res.json({
    header: { status: "success" },
    body: { data: { user: req.user } },
  });
});

export default router;

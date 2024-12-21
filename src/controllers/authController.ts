import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { AppError } from "../middlewares/errorHandler";
import { JwtPayload } from "../types";

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const authController = {
  async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError(400, "Email already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken({ id: user.id, email: user.email });

    return res.status(201).json({
      header: { status: "success" },
      body: {
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      },
    });
  },

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new AppError(401, "Invalid credentials");
    }

    const token = generateToken({ id: user.id, email: user.email });

    return res.status(200).json({
      header: { status: "success" },
      body: {
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      },
    });
  },
};

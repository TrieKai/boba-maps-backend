import nodemailer from "nodemailer";
import logger from "../utils/logger";
import { User } from "@/models";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendNotificationEmail(
    userId: number,
    title: string,
    message: string
  ): Promise<void> {
    try {
      // 根據 userId 獲取使用者的電子郵件地址
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: title,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${title}</h2>
            <p>${message}</p>
            <hr>
            <p style="color: #666;">這是一封自動發送的通知郵件，請勿直接回覆。</p>
          </div>
        `,
      });
    } catch (error) {
      logger.error("Failed to send notification email:", error);
      throw error;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "密碼重設請求",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>密碼重設請求</h2>
            <p>您收到這封郵件是因為有人請求重設您的密碼。</p>
            <p>如果這不是您發起的請求，請忽略此郵件。</p>
            <p>點擊下方連結重設密碼：</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
              重設密碼
            </a>
            <p>此連結將在 1 小時後失效。</p>
          </div>
        `,
      });
    } catch (error) {
      logger.error("Failed to send password reset email:", error);
      throw error;
    }
  }
}

export const emailService = new EmailService();

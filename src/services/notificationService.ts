import { Notification } from "../models";
import { WebSocketService } from "./webSocketService";
import { EmailService } from "./emailService";

export enum NotificationType {
  NEW_RATING = "NEW_RATING",
  FAVORITE_ADDED = "FAVORITE_ADDED",
  PLACE_UPDATED = "PLACE_UPDATED",
}

interface NotificationPayload {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

export class NotificationService {
  private wsService: WebSocketService;
  private emailService: EmailService;

  constructor() {
    this.wsService = new WebSocketService();
    this.emailService = new EmailService();
  }

  async sendNotification(payload: NotificationPayload) {
    try {
      // Save notification to database
      const notification = await Notification.create({
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        data: payload.data,
        isRead: false,
        createdAt: new Date(),
      });

      // Send real-time notification via WebSocket
      this.wsService.sendToUser(payload.userId, {
        type: "notification",
        data: notification,
      });

      // Send email notification if needed
      if (this.shouldSendEmail(payload.type)) {
        await this.emailService.sendNotificationEmail(
          payload.userId,
          payload.title,
          payload.message
        );
      }

      return notification;
    } catch (error) {
      console.error("Failed to send notification:", error);
      throw error;
    }
  }

  private shouldSendEmail(type: NotificationType): boolean {
    // Configure which notification types should trigger emails
    return [
      NotificationType.NEW_RATING,
      NotificationType.PLACE_UPDATED,
    ].includes(type);
  }

  async markAsRead(notificationId: number, userId: number) {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId },
    });

    if (notification) {
      notification.isRead = true;
      await notification.save();
    }

    return notification;
  }

  async getUserNotifications(
    userId: number,
    page: number = 1,
    limit: number = 20
  ) {
    return await Notification.findAndCountAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });
  }
}

export const notificationService = new NotificationService();

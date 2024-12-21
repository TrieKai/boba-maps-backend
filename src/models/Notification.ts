import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { NotificationType } from "../services/notificationService";

class Notification extends Model {
  public id!: number;
  public userId!: number;
  public type!: NotificationType;
  public title!: string;
  public message!: string;
  public data?: any;
  public isRead!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;

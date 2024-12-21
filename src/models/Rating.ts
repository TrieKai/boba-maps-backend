import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
import HandcupInfo from "./HandcupInfo";

class Rating extends Model {
  public id!: number;
  public userId!: number;
  public placeId!: string;
  public score!: number;
  public comment?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    placeId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: HandcupInfo,
        key: "placeId",
      },
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
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
    tableName: "ratings",
  }
);

export default Rating;

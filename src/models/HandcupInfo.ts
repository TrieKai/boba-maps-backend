import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { HandcupInfo as HandcupInfoType } from "../types";

class HandcupInfo extends Model<HandcupInfoType> implements HandcupInfoType {
  public id!: number;
  public placeId!: string;
  public name!: string;
  public latitude!: number;
  public longitude!: number;
  public rating?: number;
  public ratingsTotal?: number;
  public views!: number;
  public imageUrl?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

HandcupInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    placeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    ratingsTotal: {
      type: DataTypes.INTEGER,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
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
    tableName: "handcup_infos",
  }
);

export default HandcupInfo;

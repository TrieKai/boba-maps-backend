import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { Favorite as FavoriteType } from "../types";
import User from "./User";
import HandcupInfo from "./HandcupInfo";

class Favorite extends Model<FavoriteType> implements FavoriteType {
  public id!: number;
  public userId!: number;
  public placeId!: string;
  public createTime!: Date;
  public updateTime!: Date;
}

Favorite.init(
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
    createTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "favorites",
    timestamps: false,
  }
);

// 設置關聯
Favorite.belongsTo(User, { foreignKey: "userId" });
Favorite.belongsTo(HandcupInfo, { foreignKey: "placeId" });

export default Favorite;

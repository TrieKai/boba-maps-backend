import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class SearchHistory extends Model {
  public id!: number;
  public userId!: number;
  public keyword!: string;
  public latitude!: number;
  public longitude!: number;
  public radius!: number;
  public createdAt!: Date;
}

SearchHistory.init(
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
    keyword: {
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
    radius: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "search_histories",
    timestamps: true,
    updatedAt: false,
  }
);

export default SearchHistory;

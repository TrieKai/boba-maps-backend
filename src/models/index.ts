import User from "./User";
import HandcupInfo from "./HandcupInfo";
import Favorite from "./Favorite";
import Rating from "./Rating";
import Notification from "./Notification";
import SearchHistory from "./SearchHistory";

// 設置模型之間的關聯
User.hasMany(Favorite, { foreignKey: "userId" });
User.hasMany(Rating, { foreignKey: "userId" });
User.hasMany(Notification, { foreignKey: "userId" });

HandcupInfo.hasMany(Favorite, { foreignKey: "placeId" });
HandcupInfo.hasMany(Rating, { foreignKey: "placeId" });

Favorite.belongsTo(User, { foreignKey: "userId" });
Favorite.belongsTo(HandcupInfo, { foreignKey: "placeId" });

Rating.belongsTo(User, { foreignKey: "userId" });
Rating.belongsTo(HandcupInfo, { foreignKey: "placeId" });

Notification.belongsTo(User, { foreignKey: "userId" });

SearchHistory.belongsTo(User, { foreignKey: "userId" });

export { User, HandcupInfo, Favorite, Rating, Notification, SearchHistory };

// 可選：匯出 sequelize 實例和資料類型
export { default as sequelize } from "../config/database";
export { DataTypes } from "sequelize";

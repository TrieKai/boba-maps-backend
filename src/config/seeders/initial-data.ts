import { User, HandcupInfo } from "../../models";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    // 創建管理員用戶
    const adminPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      isAdmin: true,
    });

    // 創建測試用戶
    const userPassword = await bcrypt.hash("user123", 10);
    await User.create({
      name: "Test User",
      email: "user@example.com",
      password: userPassword,
    });

    // 創建一些測試地點
    await HandcupInfo.bulkCreate([
      {
        placeId: "test-place-1",
        name: "Test Cafe 1",
        latitude: 25.033,
        longitude: 121.5654,
        rating: 4.5,
        ratingsTotal: 100,
        views: 0,
      },
      {
        placeId: "test-place-2",
        name: "Test Cafe 2",
        latitude: 25.0334,
        longitude: 121.565,
        rating: 4.2,
        ratingsTotal: 80,
        views: 0,
      },
    ]);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HandcupInfo {
  id: number;
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  rating?: number;
  ratingsTotal?: number;
  views: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: number;
  userId: number;
  placeId: string;
  createTime: Date;
  updateTime: Date;
}

export interface JwtPayload {
  id: number;
  email: string;
}

export interface ApiResponse<T> {
  header: {
    status: "success" | "error";
  };
  body: {
    data: T;
  };
}

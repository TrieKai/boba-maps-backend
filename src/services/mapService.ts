import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import { HandcupInfo } from "../models";
import { AppError } from "../middlewares/errorHandler";

const client = new Client({});

interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radius: number;
  keyword: string;
}

export const mapService = {
  async searchNearbyPlaces({
    latitude,
    longitude,
    radius,
    keyword,
  }: NearbySearchParams) {
    try {
      const response = await client.placesNearby({
        params: {
          location: { lat: latitude, lng: longitude },
          radius,
          keyword,
          key: process.env.GOOGLE_MAPS_API_KEY!,
        },
      });

      const places = response.data.results;
      const handcupList = [];

      for (const place of places) {
        let handcupInfo = await HandcupInfo.findOne({
          where: { placeId: place.place_id },
        });

        if (!handcupInfo) {
          handcupInfo = await HandcupInfo.create({
            placeId: place.place_id,
            name: place.name,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            rating: place.rating,
            ratingsTotal: place.user_ratings_total,
            imageUrl: place.photos?.[0]?.photo_reference,
            views: 0,
          });
        } else {
          await handcupInfo.increment("views");
        }

        handcupList.push(handcupInfo);
      }

      return handcupList;
    } catch (error) {
      throw new AppError(500, "Failed to fetch nearby places");
    }
  },

  async getPlaceDetails(placeId: string, language: string) {
    try {
      const response = await client.placeDetails({
        params: {
          place_id: placeId,
          language,
          key: process.env.GOOGLE_MAPS_API_KEY!,
        },
      });

      return response.data.result;
    } catch (error) {
      throw new AppError(500, "Failed to fetch place details");
    }
  },
};

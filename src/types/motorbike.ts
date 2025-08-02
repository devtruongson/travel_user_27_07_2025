import { AlbumType } from ".";

export type MotorbikeType = {
    motorbike_id: number;
    bike_type: string;
    price_per_day: number;
    location: string;
    license_plate: string;
    description: string;
    average_rating: number;
    total_reviews: number;
    rental_status: string;
    album_id: number;
    is_deleted: string;
    created_at: string;
    updated_at: string;
    album: AlbumType;
};

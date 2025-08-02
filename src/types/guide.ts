import { AlbumType } from ".";

export type GuideType = {
    guide_id: number;
    name: string;
    gender: string;
    language: string;
    experience_years: number;
    album_id: number;
    price_per_day: string; // ví dụ "2000000.00"
    description: string | null;
    phone: string;
    email: string;
    average_rating: number;
    is_available: boolean;
    is_deleted: string;
    created_at: string;
    updated_at: string;
    album: AlbumType;
};

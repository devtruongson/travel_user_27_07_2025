import { AlbumType } from ".";

export type HotelType = {
    hotel_id: number;
    name: string;
    location: string;
    room_type: string;
    price: string; // ví dụ "1.00"
    description: string;
    image: string;
    album_id: number;
    contact_phone: string;
    contact_email: string;
    average_rating: number;
    is_available: boolean;
    max_guests: number;
    facilities: string;
    bed_type: string;
    is_deleted: string;
    created_at: string;
    updated_at: string;
    album: AlbumType;
};

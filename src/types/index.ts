export type ImageType = {
    image_id: number;
    album_id: number;
    image_url: string;
    caption: string;
    uploaded_at: string;
    is_deleted: string;
};

export type AlbumType = {
    album_id: number;
    title: string;
    updated_at: string;
    created_at: string;
    is_deleted: string;
    images: ImageType[];
};

export type SectionType = {
    id: number;
    destination_id: number;
    type: string;
    title: string;
    content: string;
};

import { SectionType } from ".";

export type DestinationType = {
    destination_id: number;
    category_id: number;
    album_id: number;
    name: string;
    description: string;
    img_banner: string;
    is_deleted: string;
    slug: string;
    img_banner_url: string;
    sections: SectionType[];
};

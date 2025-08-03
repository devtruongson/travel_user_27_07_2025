import { UserType } from "./user";

export type ReviewType = {
    review_id: number;
    user_id: number;
    tour_id: number;
    rating: number;
    comment: string;
    created_at: string;
    is_deleted: string;
    user: UserType;
};

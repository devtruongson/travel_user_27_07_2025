import { PUBLIC_API } from "@/lib/api";

export const getDestinations = async () => {
    try {
        const res = await PUBLIC_API.get(
            `${process.env.NEXT_PUBLIC_API_URL}/destinations`
        );

        return res?.data || [];
    } catch (error) {
        console.error("Error fetching destinations:", error);
        return null;
    }
};

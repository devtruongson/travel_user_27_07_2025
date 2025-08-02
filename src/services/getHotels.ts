import { PUBLIC_API } from "@/lib/api";

export const getHotels = async () => {
    try {
        const res = await PUBLIC_API.get(
            `${process.env.NEXT_PUBLIC_API_URL}/hotels`
        );

        return res?.data || [];
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return null;
    }
};

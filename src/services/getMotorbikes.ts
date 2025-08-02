import { PUBLIC_API } from "@/lib/api";

export const getMotorbikes = async () => {
    try {
        const res = await PUBLIC_API.get(
            `${process.env.NEXT_PUBLIC_API_URL}/motorbikes`
        );

        return res?.data || [];
    } catch (error) {
        console.error("Error fetching motorcycles:", error);
        return null;
    }
};

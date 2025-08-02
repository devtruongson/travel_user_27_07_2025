import { PUBLIC_API } from "@/lib/api";

export const getGuides = async () => {
    try {
        const res = await PUBLIC_API.get(
            `${process.env.NEXT_PUBLIC_API_URL}/guides`
        );
        return res?.data || [];
    } catch (error) {
        console.error("Error fetching guides:", error);
        return null;
    }
};

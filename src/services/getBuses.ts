import { PUBLIC_API } from "@/lib/api";

export const getBuses = async () => {
    try {
        const res = await PUBLIC_API.get(
            `${process.env.NEXT_PUBLIC_API_URL}/buses`
        );

        return res?.data || [];
    } catch (error) {
        console.error("Error fetching buses:", error);
        return null;
    }
};

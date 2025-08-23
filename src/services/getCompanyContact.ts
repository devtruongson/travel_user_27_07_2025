import { API } from "@/lib/api";

export interface CompanyContact {
    id: number;
    address: string;
    hotline: string;
    email: string;
    website: string;
    is_deleted: string;
    created_at: string;
    updated_at: string;
}

export const getCompanyContact = async (): Promise<CompanyContact | null> => {
    try {
        const response = await API.get("/company-contacts");
        return response.data;
    } catch (error) {
        console.error("Error fetching company contact:", error);
        return null;
    }
};

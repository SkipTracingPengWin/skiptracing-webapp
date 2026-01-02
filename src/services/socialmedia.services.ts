import api from "@/lib/axios";
import { SocialMediaSearchResponse } from "@/types/socialmedia.type";

export const socialMediaService = {
    searchSocialMedia: async (borrowerId: string, name: string): Promise<SocialMediaSearchResponse> => {
        try {
            const response = await api.post("/social-media/search", {
                borrowerId,
                name
            });
            return response.data;
        } catch (error: any) {
            console.error("❌ Error in searchSocialMedia:", error.message);
            throw error;
        }
    }
};

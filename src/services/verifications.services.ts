import api from '@/lib/axios';

export const verificationService = {
    getAll: async () => {
        const response = await api.get('/verifications/');
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/verifications/', data);
        return response.data;
    }
};

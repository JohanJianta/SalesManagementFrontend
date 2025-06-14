import { getRequest } from "../services/apiService";

const API_ENDPOINT = "/promotions";

export const getPromotions = async () => {
  try {
    const data = await getRequest<BriefPromotion[]>(`${API_ENDPOINT}`);
    return data;
  } catch (error: any) {
    throw error?.[0] || error;
  }
};

export const getPromotionById = async (id: number) => {
  try {
    const data = await getRequest<DetailPromotion>(`${API_ENDPOINT}/${id}`);
    return data;
  } catch (error: any) {
    throw error?.[0] || error;
  }
};

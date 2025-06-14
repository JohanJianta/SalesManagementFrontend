import { getRequest } from "../services/apiService";

const API_ENDPOINT = "/products";

export async function getAvailableProperties() {
  try {
    const data = await getRequest<PropertyCluster[]>(`${API_ENDPOINT}`);
    return data;
  } catch (error: any) {
    throw error?.[0] || error;
  }
}

export const getProductById = async (id: number) => {
  try {
    const data = await getRequest<DetailProduct>(`${API_ENDPOINT}/${id}`);
    return data;
  } catch (error: any) {
    throw error?.[0] || error;
  }
};

import { getRequest } from "./apiService";

const API_ENDPOINT = "/clusters";

const getClusters = async () => {
  try {
    const data = await getRequest<ClusterResponse>(`${API_ENDPOINT}`);
    return data;
  } catch (error) {
    throw error;
  }
};

const getClusterById = async (id: number) => {
  try {
    const data = await getRequest<any>(`${API_ENDPOINT}/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  getClusters,
  getClusterById,
};

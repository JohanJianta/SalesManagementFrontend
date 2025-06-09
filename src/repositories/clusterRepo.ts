import { getRequest } from "../services/apiService";

const API_ENDPOINT = "/clusters";

export const getClusters = async () => {
  try {
    const data = await getRequest<ClusterResponse>(`${API_ENDPOINT}`);
    return data;
  } catch (error: any) {
    throw error?.[0] || error;
  }
};

export const getClusterById = async (id: number) => {
  try {
    const data = await getRequest<DetailCluster>(`${API_ENDPOINT}/${id}`);
    return data;
  } catch (error: any) {
    throw error?.[0] || error;
  }
};

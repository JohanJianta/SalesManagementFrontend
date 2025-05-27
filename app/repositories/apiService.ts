import { getFromStorage } from "../shared/asyncUtil";
import { BASE_URL } from "../shared/constant";
import axios from "axios";

export async function getRequest<T>(endpoint: string): Promise<T> {
  try {
    const token = await getFromStorage<string>("token");
    if (!token) throw new Error("Token tidak ditemukan.");

    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function postRequest<T>(endpoint: string, data: any, withoutAuthorization?: boolean): Promise<T> {
  try {
    let token: string | null = null;
    if (!withoutAuthorization) {
      token = await getFromStorage<string>("token");
      if (!token) throw new Error("Token tidak ditemukan.");
    }

    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: withoutAuthorization ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  } catch (error: any) {
    console.error("Post request error:", error.message);
    throw error;
  }
}

export default {
  getRequest,
  postRequest,
};

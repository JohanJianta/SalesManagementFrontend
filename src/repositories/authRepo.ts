import { saveToStorage } from "../shared/asyncStorageUtils";
import { postRequest } from "../services/apiService";

const API_ENDPOINT = "/auth";

export async function register(name: string, email: string, password: string) {
  try {
    const requestData = { name, email, password };
    const responseData = await postRequest<AuthResponse>(`${API_ENDPOINT}/register`, requestData, true);

    await saveToStorage("token", responseData.token);
    await saveToStorage("user", responseData.payload);
  } catch (error: any) {
    throw error[0];
  }
}

export async function login(email: string, password: string) {
  try {
    const requestData = { email, password };
    const responseData = await postRequest<AuthResponse>(`${API_ENDPOINT}/login`, requestData, true);

    await saveToStorage("token", responseData.token);
    await saveToStorage("user", responseData.payload);
  } catch (error: any) {
    throw error[0];
  }
}

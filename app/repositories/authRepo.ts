import { saveToStorage } from "../shared/asyncUtil";
import { postRequest } from "./apiService";

const API_ENDPOINT = "/auth";

export async function register(name: string, email: string, password: string) {
  try {
    const requestData = { name, email, password };
    const responseData = await postRequest<AuthResponse>(`${API_ENDPOINT}/register`, requestData, true);

    await saveToStorage("token", responseData.token);
    await saveToStorage("user", responseData.payload);
  } catch (error) {
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const requestData = { email, password };
    const responseData = await postRequest<AuthResponse>(`${API_ENDPOINT}/login`, requestData, true);

    await saveToStorage("token", responseData.token);
    await saveToStorage("user", responseData.payload);
  } catch (error) {
    throw error;
  }
}

export default {
  register,
  login,
};

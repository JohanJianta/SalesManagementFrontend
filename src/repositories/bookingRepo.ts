import { getRequest, postRequest, putRequest } from "../services/apiService";

const API_ENDPOINT = "/bookings";

export const getBookings = async () => {
  try {
    const data = await getRequest<BriefBooking[]>(`${API_ENDPOINT}`);
    return data;
  } catch (error: any) {
    throw error?.[0] || error;
  }
};

export const getBookingById = async (id: number) => {
  try {
    const data = await getRequest<DetailBooking>(`${API_ENDPOINT}/${id}`);
    return data;
  } catch (error: any) {
    throw error?.[0] || error;
  }
};

export async function addBooking(
  customer_name: string,
  identification_number: string,
  phone: string,
  dp_price: number,
  unit_id: number
) {
  try {
    const requestData = { customer_name, identification_number, phone, dp_price, unit_id };
    const responseData = await postRequest<DetailBooking>(`${API_ENDPOINT}`, requestData);
    return responseData;
  } catch (error: any) {
    throw error?.[0] || error;
  }
}

export async function updateBooking(booking_id: number, status: string) {
  try {
    const requestData = { booking_id, status };
    const responseData = await putRequest<DetailBooking>(`${API_ENDPOINT}`, requestData);
    return responseData;
  } catch (error: any) {
    throw error?.[0] || error;
  }
}

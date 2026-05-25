import { axiosClient } from "@/services/api/axiosClient";
import { AuthResponse, LoginPayload } from "@/types/auth";

export const loginApi = async (payload: LoginPayload) => {
  const response = await axiosClient.post<AuthResponse>("/login", payload);
  return response.data;
};

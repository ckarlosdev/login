import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "./authStore";

const API_BASE_URL = "https://api-gateway-px44.onrender.com/api/auth";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const queryMe = async (token: string) => {
  const { data } = await api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

function useUser() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["user", token],
    queryFn: () => queryMe(token!),
    enabled: !!token,
    retry: false,
  });
}

export default useUser;

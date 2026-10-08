import { client } from "@/api/client";
import type { User, Credentials, ResetRequest, ResetResponse } from "./types";
export const authApi = {
  me: async () => (await client.get<User>("/auth/me")).data,
  login: async (data: Credentials) =>
    (await client.post<User>("/auth/login", data)).data,
  logout: async () => {
    await client.post("/auth/logout");
  },
  forgot: async (email: string) =>
    (await client.post<ResetResponse>("/auth/forgot-password", { email })).data,
  reset: async (data: ResetRequest) => {
    await client.post("/auth/reset-password", data);
  },
};

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { authApi } from "./api";
export const userKey = ["auth", "me"] as const;
export function useCurrentUser() {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: userKey,
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 401) return null;
        throw e;
      }
    },
    retry: false,
    refetchInterval: 15000,
  });
  useEffect(() => {
    if (query.data === null)
      client.removeQueries({ predicate: (q) => q.queryKey[0] !== "auth" });
  }, [query.data, client]);
  return query;
}

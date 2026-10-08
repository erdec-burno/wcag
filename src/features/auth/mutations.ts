import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "./api";
import { userKey } from "./queries";
export function useLogin() {
  const c = useQueryClient();
  const n = useNavigate();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (user) => {
      await c.cancelQueries();
      c.clear();
      c.setQueryData(userKey, user);
      n("/admin/dashboard", { replace: true });
    },
  });
}
export function useLogout() {
  const c = useQueryClient();
  const n = useNavigate();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      await c.cancelQueries();
      c.clear();
      c.setQueryData(userKey, null);
      n("/login", { replace: true });
    },
  });
}
export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgot });
}
export function useResetPassword() {
  const c = useQueryClient();
  const n = useNavigate();
  return useMutation({
    mutationFn: authApi.reset,
    onSuccess: async () => {
      await c.cancelQueries();
      c.clear();
      c.setQueryData(userKey, null);
      n("/login", { replace: true, state: { passwordReset: true } });
    },
  });
}

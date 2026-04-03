import { useMutation } from "@tanstack/react-query";
import { login } from "../../services/api/auth.service";
import { setToken } from "../../utils/authStorage";
import type { LoginPayload, LoginResponse } from "../../types/auth/auth.types";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}
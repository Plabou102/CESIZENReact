import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/api/auth.service";
import { isAuthenticated } from "../../utils/authStorage";
import type { AuthUser } from "../../types/auth/auth.types";

export function useMe() {
  return useQuery<AuthUser>({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: isAuthenticated(),
    retry: false,
  });
}
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { removeToken } from "../../utils/authStorage";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function logout() {
    removeToken();
    queryClient.clear();
    navigate("/login");
  }

  return { logout };
}
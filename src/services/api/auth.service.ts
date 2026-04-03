import api from "./client";
import type { AuthUser, LoginResponse } from "../../types/auth/auth.types";

export async function login(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  console.log("=== AUTH SERVICE LOGIN ===");
  console.log("payload reçu par le service :", payload);

  const { data } = await api.post("/auth/login", payload);

  console.log("réponse login :", data);

  return data;
}

export async function getMe(): Promise<AuthUser> {
  console.log("=== AUTH SERVICE ME ===");
  const { data } = await api.get("/auth/me");
  console.log("réponse me :", data);
  return data;
}
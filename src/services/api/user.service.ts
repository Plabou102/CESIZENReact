import api from "./client";
import type { User, CreateUserPayload, UpdateUserPayload } from "../../types/user/user.types";

export async function getAllUsers(): Promise<User[]> {
  const { data } = await api.get("/users");
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { password, ...rest } = payload;
  const { data } = await api.post("/users", { ...rest, passwordHash: password });
  return data;
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.patch(`/users/${id}`, payload);
  return data;
}

export async function deactivateUser(id: number): Promise<void> {
  await api.patch(`/users/${id}/deactivate`);
}

export async function reactivateUser(id: number): Promise<void> {
  await api.patch(`/users/${id}/reactivate`);
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
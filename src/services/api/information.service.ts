// src/services/api/information.service.ts

import api from "./client";
import type { Information, CreateInformationPayload, UpdateInformationPayload } from "../../types/information/information.types";

export async function getAllInformations(): Promise<Information[]> {
  const { data } = await api.get("/informations");
  return data;
}

export async function getInformationById(id: number): Promise<Information> {
  const { data } = await api.get(`/informations/${id}`);
  return data;
}

export async function createInformation(payload: CreateInformationPayload): Promise<Information> {
  const { data } = await api.post("/informations", payload);
  return data;
}

export async function updateInformation(id: number, payload: UpdateInformationPayload): Promise<Information> {
  const { data } = await api.patch(`/informations/${id}`, payload);
  return data;
}

export async function deleteInformation(id: number): Promise<void> {
  await api.delete(`/informations/${id}`);
}
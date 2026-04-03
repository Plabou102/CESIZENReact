import api from "./client";
import type {
  BreathingExercise,
  CreateBreathingExercisePayload,
  UpdateBreathingExercisePayload,
} from "../../types/breathingExercise/breathingExercise.types";

export async function getAllBreathingExercises(): Promise<BreathingExercise[]> {
  const { data } = await api.get("/breathing-exercises");
  return data;
}

export async function createBreathingExercise(payload: CreateBreathingExercisePayload): Promise<BreathingExercise> {
  const { data } = await api.post("/breathing-exercises", payload);
  return data;
}

export async function updateBreathingExercise(id: number, payload: UpdateBreathingExercisePayload): Promise<BreathingExercise> {
  const { data } = await api.patch(`/breathing-exercises/${id}`, payload);
  return data;
}

export async function deactivateBreathingExercise(id: number): Promise<BreathingExercise> {
  const { data } = await api.patch(`/breathing-exercises/${id}`, { isActive: false });
  return data;
}

export async function reactivateBreathingExercise(id: number): Promise<BreathingExercise> {
  const { data } = await api.patch(`/breathing-exercises/${id}`, { isActive: true });
  return data;
}

export async function deleteBreathingExercise(id: number): Promise<void> {
  await api.delete(`/breathing-exercises/${id}`);
}
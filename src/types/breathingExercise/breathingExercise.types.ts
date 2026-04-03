export type BreathingExercise = {
  id: number;
  label: string;
  description: string;
  inhaleDuration: number;
  holdDuration: number;
  exhaleDuration: number;
  totalDuration: number;
  isActive: boolean;
  createdById?: number;
  createdAt: string;
};

export type CreateBreathingExercisePayload = {
  label: string;
  description: string;
  inhaleDuration: number;
  holdDuration: number;
  exhaleDuration: number;
  totalDuration: number;
};

export type UpdateBreathingExercisePayload = Partial<CreateBreathingExercisePayload & { isActive: boolean }>;
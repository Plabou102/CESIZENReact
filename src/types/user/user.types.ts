// src/types/user/user.types.ts

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
};

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
};

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, "password">>;
// src/types/information/information.types.ts

export type Information = {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateInformationPayload = {
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
};

export type UpdateInformationPayload = Partial<CreateInformationPayload> & {
  isActive?: boolean;
};
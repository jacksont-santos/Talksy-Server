import { ZodSchema, z } from "zod";

export const updateUserDTO: ZodSchema = z.object({
  username: z.string().min(6, "too short").max(24, "too long").optional(),
  password: z.string().min(6, "too short").max(24, "too long").optional(),
  nickname: z.string().min(4, "too short").max(24, "too long").optional(),
});
import { ZodSchema, z } from "zod";

export const createUserDTO: ZodSchema = z.object({
  username: z.string().min(6, "too short").max(24, "too long"),
  password: z.string().min(6, "too short").max(24, "too long"),
  nickname: z.string().min(4, "too short").max(24, "too long"),
});
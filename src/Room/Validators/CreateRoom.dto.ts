import { ZodSchema, z } from "zod";

export const createRoomDTO: ZodSchema = z.object({
  name: z.string().min(4, "too short").max(30, "too long"),
  password: z.string().min(6, "too short").max(16, "too long").optional(),
  maxUsers: z
    .number()
    .int("Is not Int number")
    .min(2, "Invalid users number")
    .max(10, "Invalid users number"),
  isPublic: z.enum(["true", "false"]),
});
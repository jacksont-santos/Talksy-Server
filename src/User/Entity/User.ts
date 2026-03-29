import mongoose from "mongoose";
import { randomUUID } from "crypto";

export interface IUser {
  _id: string;
  username: string;
  password: string;
  nickname: string;
}

const userSchema = new mongoose.Schema<IUser>({
  _id: { type: String, default: () => randomUUID() },
  username: {
    type: String,
    unique: true,
    required: true,
    validate: (value) => value.length >= 6 && value.length <= 24,
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: (value) => value.length > 30,
  },
  nickname: {
    type: String,
    unique: true,
    required: true,
    validate: (value) => value.length >= 4 && value.length <= 24,
  }
});

export const UserModel = mongoose.model<IUser>("user", userSchema);

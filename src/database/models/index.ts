import mongoose, { Schema } from 'mongoose';
import { randomUUID } from 'crypto';

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => randomUUID(), unique: true },
  username: { type: String, unique: true, required: true, validate: (value) => value.length >= 4 && value.length <= 16 },
  password: { type: String, required: true, validate: (value) => value.length > 30 },
});

const userModel = mongoose.model('user', userSchema);

const roomSchema = new mongoose.Schema({
  _id: { type: String, default: () => randomUUID(), unique: true },
  ownerId: { type: String, required: true },
  name: { type: String, required: true, validate: (value) => value.length >= 4 && value.length <= 30 },
  maxUsers: { type: Number, required: true, validate: (value) => value >= 2 && value <= 10 },
  password: { type: String, required: false, validate: (value) => value.length > 30 },
  public: { type: Boolean, required: true, default: true },
  active: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now(), required: true },
  updatedAt: { type: Date, default: Date.now(), required: true },
});

const roomModel = mongoose.model('room', roomSchema);

export { userModel, roomModel, userSchema, roomSchema }

export interface User {
  _id: string;
  username: string;
  password: string;
}

export interface Room {
  _id: string;
  ownerId: string;
  name: string;
  maxUsers: number;
  public: boolean;
  active: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date
}
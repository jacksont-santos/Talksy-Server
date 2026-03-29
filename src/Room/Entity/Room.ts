import mongoose from "mongoose";
import { randomUUID } from "crypto";

export interface IRoom {
  _id: string;
  ownerId: string;
  name: string;
  maxUsers: number;
  public: boolean;
  active: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new mongoose.Schema<IRoom>({
  _id: {
    type: String,
    default: () => randomUUID()
  },
  ownerId: {
    type: String,
    required: true 
  },
  name: {
    type: String,
    required: true,
    validate: (value) => value.length >= 4 && value.length <= 30 
  },
  maxUsers: { 
    type: Number,
    required: true,
    validate: (value) => value >= 2 && value <= 10 
  },
  public: {
    type: Boolean,
     required: true,
     default: true
  },
  active: {
    type: Boolean,
     required: true,
     default: true
  },
  password: {
    type: String,
    required: false,
    select: false,
    validate: (value) => value.length > 30
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    required: true
  },

});
  
export const RoomModel = mongoose.model('room', roomSchema);
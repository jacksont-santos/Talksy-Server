import mongoose from "mongoose";

export interface IRoomMembers {
  _id: string;
  ownerId: string;
  roomId: string;
  users: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roomMembersSchema = new mongoose.Schema({
  _id: { type: String },
  ownerId: { type: String, required: true },
  roomId: { type: String, required: true },
  users: { type: Array<String>, default: [], required: true },
  createdAt: { type: Date, default: new Date(), required: true },
  updatedAt: { type: Date, default: new Date(), required: true },
});

export const roomMembersModel = mongoose.model('roomMembers', roomMembersSchema);
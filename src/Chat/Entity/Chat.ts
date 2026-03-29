import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

type Chat = {
  id: string;
  userId: string;
  nickname: string;
  content: string;
  createdAt: Date;
}

const chatSchema = new mongoose.Schema({
  _id: { type: String, default: () => randomUUID() },
  roomId: { type: String, required: true },
  chat: { type: Array<Chat>, default: [], required: true },
  createdAt: { type: Date, default: new Date(), required: true },
  updatedAt: { type: Date, default: new Date(), required: true },
});
export const chatModel = mongoose.model('chat', chatSchema);
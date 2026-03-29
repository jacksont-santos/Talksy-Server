import { chatModel } from "../Entity/Chat";

export class ChatRepository {

  async getRoomChat(roomId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await chatModel.aggregate([
      { $match: { roomId } },
      {
        $project: {
          _id: 0,
          chat: { $slice: ["$chat", skip, limit] },
        },
      },
    ]);
  }
}

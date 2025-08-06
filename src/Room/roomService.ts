import { roomModel, chatModel } from "../database/models";
import { httpResponse } from "../utils/response";
import { hashPassword } from "../utils/crypto";
import { WSService } from "../ws/wsService";

interface roomConfigs {
  name: string;
  maxUsers: number;
  isPublic: boolean;
  active?: boolean;
  password?: string;
}

const wsService = new WSService();

export class RoomService {

  async getPublicRooms(): Promise<httpResponse> {
    const rooms = await roomModel.find({ public: true }, { password: 0 });
    return {statusCode: 200, data: rooms.length ? rooms : []};
  }

  async getRoomById(roomId: string): Promise<httpResponse> {
    const room = await roomModel.findOne({ _id: roomId }, { password: 0 });
    if (!room) return {statusCode: 404}
    return {statusCode: 200, data: room};
  }

  async getPrivateRooms(ownerId: string): Promise<httpResponse> {
    const privateRooms = await roomModel.find({ ownerId, public: false }, { password: 0 });
    return {statusCode: 200, data: privateRooms.length ? privateRooms : []};
  }

  async getPrivateRoomById(roomId: string): Promise<httpResponse> {
    const privateRoom = await roomModel.findOne({ _id: roomId }, { password: 0 });
    if (!privateRoom) return {statusCode: 404}
    return {statusCode: 200, data: privateRoom};
  }

  async createRoom(
    ownerId: string,
    { name, maxUsers, isPublic, password }: roomConfigs
  ): Promise<httpResponse> {

    if (!isPublic && !password)
      return {statusCode: 400, message: "Password is required for private rooms"};

    const newRoomData = {
      ownerId,
      name,
      maxUsers,
      active: true,
      public: !!isPublic,
      password: password ? await hashPassword(password) : undefined,
    };
    const room = (await roomModel.create(newRoomData)).toObject();
    if (!room) return {statusCode: 500, message: "Internal server error"}

    if (room.password) delete room.password;
    const message = {
      notification: true,
      type: 'addRoom',
      userId: ownerId,
      data: {...room, roomId: room._id}
    };
    const {success} = await wsService.sendMessage(message);
    return {
      statusCode: 201,
      message: success ? 'Room created successfully' : 'Communication failed',
      data: room
    };
  }

  async editRoom(
    userId: string,
    roomId: string,
    { name, maxUsers, isPublic, active, password }: roomConfigs
  ): Promise<httpResponse> {
    const room = await roomModel.findOne({ _id: roomId, ownerId: userId });
    if (!room) return {statusCode: 404, message: "Room not found"};

    if (room.ownerId != userId)
      return {statusCode: 401, message: "Unauthorized"};

    if (!name && !maxUsers && !isPublic && !password)
      return {statusCode: 400, message: "Missing required fields"};

    if (!isPublic && !password && !room.password)
      return {statusCode: 400, message: "Password is required for private rooms"};

    room.name = name || room.name;
    room.maxUsers = maxUsers || room.maxUsers;
    room.public = isPublic || room.public;
    room.active = active || room.active;
    room.password = isPublic ? undefined : password ? await hashPassword(password) : room.password;

    const updatedRoom = (await room.save()).toObject();

    if (updatedRoom.password) delete updatedRoom.password;
    const message = {
      notification: true,
      type: 'updateRoom',
      userId,
      data: {...updatedRoom, roomId: room._id}
    };
    const {success} = await wsService.sendMessage(message);
    return {
      statusCode: 200,
      message: success ? 'Room updated successfully' : 'Communication failed',
      data: updatedRoom
    };
  }

  async deleteRoom(
    userId: string,
    roomId: string
  ): Promise<httpResponse> {
    const response = await roomModel.findOneAndDelete(
      { _id: roomId, ownerId: userId },
      { projection: { public: 1 }}
    );
    if (!response) return {statusCode: 404, message: "Room not found"};

    const message = {
      notification: true,
      type: 'removeRoom',
      userId,
      data: { roomId, public: response.public  },
    };

    const {success} = await wsService.sendMessage(message);
    return {
      statusCode: 200,
      message: success ? 'Room deleted successfully' : 'Communication failed',
      data: { _id: roomId }
    };
  }

  async getRoomMessages(roomId: string, page: number = 1, limit: number = 10): Promise<httpResponse> {
    const room = await roomModel.exists({ _id: roomId });
    if (!room) return {statusCode: 404, message: "Room not found"};
    const skip = (page - 1) * limit;
    const messages = await chatModel.aggregate([
      { $match: { roomId } },
      { $project: {
        _id: 0,
        chat: {$slice: [ '$chat', skip, limit ] }
      }}
    ]);
    const data = messages.length ? messages[0].chat.reverse() : [];
    return {statusCode: 200, data};
  }
}

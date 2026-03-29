import { hashPassword } from "../../utils/crypto";
import { WSService } from "../../ws/wsService";
import { IRoom } from "../Entity/Room";
import { RoomRepository } from "../Repository/RoomRepository";
import { ChatRepository } from "../../Chat/Repository/ChatRepository";
import { AppError } from "../../utils/AppError";
import { verifyToken } from "../../utils/jwt";

interface createRoomDTO {
  name: string;
  maxUsers: number;
  isPublic: "true" | "false";
  active?: boolean;
  password?: string;
}
interface updateRoomDTO {
  name?: string;
  maxUsers?: number;
  isPublic?: "true" | "false";
  active?: boolean;
  password?: string;
}

const wsService = new WSService();

export class RoomService {

  private roomRepository: RoomRepository;
  private chatRepository: ChatRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
    this.chatRepository = new ChatRepository();
  }

  async getPublicRooms(): Promise<IRoom[]> {
    return await this.roomRepository.findPublicRooms();
  }

  async getRoomById(roomId: string): Promise<IRoom> {
    const room = await this.roomRepository.findPublicRoom(roomId);
    if (!room) throw new AppError(404, "Room not found");
    return room;
  }

  async getPrivateRooms(ownerId: string): Promise<IRoom[]> {
    return await this.roomRepository.findPrivateRooms(ownerId);
  }

  async getPrivateRoomById(roomId: string, ownerId: string): Promise<IRoom> {
    const room = await this.roomRepository.findPrivateRoom(roomId, ownerId);
    if (!room) throw new AppError(404, "Room not found");
    return room;
  }

  async getInvitedRoom(roomId: string, authToken: string): Promise<IRoom> {
    const { _id: ownerId } = verifyToken(authToken);
    if (!ownerId) throw new AppError(403, "Invalid token");
    return await this.roomRepository.findPrivateRoom(roomId, ownerId);
  }

  async getMemberRooms(userId: string): Promise<IRoom[]> {
    const roomIds = await this.roomRepository.findMemberRooms(userId);
    return await this.roomRepository.findRoomsByIds(roomIds);
  }

  async createRoom(
    ownerId: string,
    { name, maxUsers, isPublic, password }: createRoomDTO
  ): Promise<IRoom> {

    if (isPublic == "false" && !password)
      throw new AppError(400, "Password is required for private rooms");

    const newRoomData = {
      ownerId,
      name,
      maxUsers,
      active: true,
      public: isPublic == "true",
      password: password ? await hashPassword(password) : undefined,
    };
    const room = await this.roomRepository.create(newRoomData);
    if (!room) throw new AppError(500, "Internal server error");

    if (room.password) delete room.password;
    const message = {
      notification: true,
      type: 'addRoom',
      userId: ownerId,
      data: {...room, roomId: room._id}
    };
    await wsService.sendMessage(message);
    return room;
  }

  async editRoom(
    userId: string,
    roomId: string,
    { name, maxUsers, isPublic, active, password }: updateRoomDTO
  ): Promise<IRoom> {
    const room = await this.roomRepository.findOneRoom(
      roomId,
      { password: 1, ownerId: 1, public: 1, active: 1, maxUsers: 1, name: 1 });
    if (!room) throw new AppError(404, "Room not found");

    if (room.ownerId != userId)
      throw new AppError(403, "Only the room owner can edit the room");

    if (!name && !maxUsers && !isPublic && !password && !active)
      throw new AppError(400, "Missing required fields");

    if (
      (!password && !room.password) && 
      (isPublic && isPublic === "false")
    )
      throw new AppError(400, "Password is required for private rooms");

    if (
      (!password && !room.password) && 
      (isPublic === undefined && !room.public)
    )
      throw new AppError(400, "Password is required for private rooms");

    room.name = name || room.name;
    room.maxUsers = maxUsers || room.maxUsers;
    room.public = isPublic ? isPublic == "true" : room.public;
    room.active = active || room.active;
    room.password = isPublic == "true" ? undefined : password ? await hashPassword(password) : room.password;

    const updatedRoom = await this.roomRepository.update(roomId, room);

    if (updatedRoom.password) delete updatedRoom.password;
    const message = {
      notification: true,
      type: 'updateRoom',
      userId,
      data: {...updatedRoom, roomId: room._id}
    };
    await wsService.sendMessage(message);
    return updatedRoom;
  }

  async deleteRoom(
    userId: string,
    roomId: string
  ): Promise<{ _id: string }> {
    const response = await this.roomRepository.delete(roomId, userId);
    if (!response) throw new AppError(404, "Room not found or you are not the owner");
    await this.roomRepository.deleteMemberList(roomId);

    const message = {
      notification: true,
      type: 'removeRoom',
      userId,
      data: { roomId, public: response.public  },
    };

    await wsService.sendMessage(message);
    return { _id: roomId };
  }

  async getRoomMessages(roomId: string, page: number = 1, limit: number = 10): Promise<Array<{ senderId: string, message: string, timestamp: Date }>> {
    const room = await this.roomRepository.existRoom(roomId);
    if (!room) throw new AppError(404, "Room not found");
    const messages = await this.chatRepository.getRoomChat(roomId, page, limit);
    const data = messages.length ? messages[0].chat.reverse() : [];
    return data;
  }
}

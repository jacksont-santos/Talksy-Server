import { RoomModel, IRoom } from "../Entity/Room";
import { roomMembersModel, IRoomMembers } from "../Entity/RoomMembers";

export class RoomRepository {

  async findPublicRoom(roomId: string): Promise<IRoom> {
    return await RoomModel.findOne({ _id: roomId, public: true }).lean();
  }

  async findPrivateRoom(_id: string, ownerId: string): Promise<IRoom> {
    return await RoomModel.findOne({ _id, ownerId, public: false }).lean();
  }

  async findOneRoom(roomId: string, projection: any = {}): Promise<IRoom> {
    return await RoomModel.findOne({ _id: roomId }, projection).lean();
  }

  async findPublicRooms(): Promise<IRoom[]> {
    return await RoomModel.find({ public: true }).lean();
  }

  async findPrivateRooms(ownerId: string): Promise<IRoom[]> {
    return await RoomModel.find({ ownerId, public: false }).lean();
  }

  async findMemberRooms(userId: string): Promise<IRoomMembers['roomId'][]> {
    const rooms = await roomMembersModel.find(
      { users: userId, ownerId: { $ne: userId } },
      { roomId: 1 }
    ).lean();
    return rooms.map((room) => room.roomId);
  }

  async deleteMemberList(roomId: string): Promise<IRoomMembers | null> {
    return await roomMembersModel.findOneAndDelete({ roomId });
  }

  async findRoomsByIds(roomIds: string[], projection: any = {}): Promise<IRoom[]> {
    return await RoomModel.find({ _id: { $in: roomIds } }, projection).lean();
  }

  async create(roomData: Partial<IRoom>): Promise<IRoom> {
    const newRoom = await RoomModel.create(roomData);
    return newRoom.toObject();
  }

  async update(roomId: string, roomData: Partial<IRoom>): Promise<IRoom> {
    const updatedRoom = await RoomModel.findByIdAndUpdate(roomId, roomData, { new: true }).lean();
    return updatedRoom;
  }

  async delete(roomId: string, ownerId: string): Promise<Partial<IRoom>> {
    return await RoomModel.findOneAndDelete({ _id: roomId, ownerId }, { projection: { public: 1 }});
  }

  async existRoom(roomId: string): Promise<{ _id: string } | null> {
    return await RoomModel.exists({ _id: roomId });
  }

}
import { Request, Response } from "express";
import { RoomService } from "./../Service/RoomService";

const roomService = new RoomService();

export class RoomController {
  async getPublicRooms(req: Request, res: Response) {
    const response = await roomService.getPublicRooms();
    res.status(200).json({ data: response });
  }

  async getRoomById(req: Request, res: Response) {
    const roomId = req.params.id;
    const response = await roomService.getRoomById(roomId);
    res.status(200).json({ data: response });
  }

  async getPrivateRooms(req: Request, res: Response) {
    const userId = (<any>req.headers).userData._id;
    const response = await roomService.getPrivateRooms(userId);
    res.status(200).json({ data: response });
  }

  async getPrivateRoomById(req: Request, res: Response) {
    const roomId = req.params.id;
    const userId = (<any>req.headers).userData._id;
    const response = await roomService.getPrivateRoomById(roomId, userId);
    res.status(200).json({ data: response });
  }

  async getInvitedRoom(req: Request, res: Response) {
    const roomId = req.params.id;
    const authToken = req.params.token;
    const response = await roomService.getInvitedRoom(roomId, authToken);
    res.status(200).json({ data: response });
  }

  async getMemberRooms(req: Request, res: Response) {
    const userId = (<any>req.headers).userData._id;
    const response = await roomService.getMemberRooms(userId);
    res.status(200).json({ data: response });
  }

  async getRoomMessages(req: Request, res: Response) {
    const { roomId } = req.params;
    const { page, limit } = req.query;
    const response = await roomService.getRoomMessages(roomId, Number(page), Number(limit));
    res.status(200).json({ data: response });
  }

  async createRoom(req: Request, res: Response) {
    const { name, maxUsers, isPublic, password } = req.body;
    const userId = (<any>req.headers).userData._id;
    const response = await roomService.createRoom(userId, {
      name,
      maxUsers,
      isPublic,
      password,
    });
    res.status(201).json({ message: "Room created successfully", data: response });
  }

  async editRoom(req: Request, res: Response) {
    const roomId = req.params.id;
    const { name, maxUsers, isPublic, active, password } = req.body;
    const userId = (<any>req.headers).userData._id;
    const response = await roomService.editRoom(userId, roomId, {
      name,
      maxUsers,
      isPublic,
      active,
      password,
    });
    res.status(200).json({ message: "Room updated successfully", data: response });
  }

  async deleteRoom(req: Request, res: Response) {
    const roomId = req.params.id;
    const userId = (<any>req.headers).userData._id;
    const response = await roomService.deleteRoom(userId, roomId);
    res.status(200).json({ message: "Room deleted successfully", data: response });
  }

}

import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { RoomService } from "./roomService";
import { validateRoomDTO } from "./roomValidator";

const router = Router();

const roomService = new RoomService();

router.get("/", async (req: Request, res: Response) => {
  const response = await roomService.getPublicRooms();

  res
    .status(response.statusCode)
    .json({ message: response.message, data: response.data });
});

router.get("/id/:id", async (req: Request, res: Response) => {
  const roomId = req.params.id;
  const response = await roomService.getRoomById(roomId);

  res
    .status(response.statusCode)
    .json({ message: response.message, data: response.data });
});

router.get("/private", authMiddleware, async (req: Request, res: Response) => {
  const userId = (<any>req.headers).userData._id;
  const response = await roomService.getPrivateRooms(userId);

  res
    .status(response.statusCode)
    .json({ message: response.message, data: response.data });
});

router.get("/private/:id", authMiddleware, async (req: Request, res: Response) => {
  const roomId = req.params.id;
  const userId = (<any>req.headers).userData._id;
  const response = await roomService.getPrivateRoomById(roomId, userId);

  res
    .status(response.statusCode)
    .json({ message: response.message, data: response.data });
});

router.post("/create", [authMiddleware, validateRoomDTO], async (req: Request, res: Response) => {
  const { name, maxUsers, isPublic, password } = req.body;
  const userId = (<any>req.headers).userData._id;

  const response = await roomService.createRoom(userId, {
    name,
    maxUsers,
    isPublic,
    password,
  });

  res
    .status(response.statusCode)
    .json({ message: response.message, data: response.data });
});

router.put("/update/:id", [authMiddleware, validateRoomDTO], async (req: Request, res: Response) => {
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
  res
    .status(response.statusCode)
    .json({ message: response.message, data: response.data });
});

router.delete("/delete/:Id", authMiddleware, async (req: Request, res: Response) => {
  const roomId = req.params.Id;
  const userId = (<any>req.headers).userData._id;
  const response = await roomService.deleteRoom(userId, roomId);

  res
    .status(response.statusCode)
    .json({ message: response.message });
});

export default router;

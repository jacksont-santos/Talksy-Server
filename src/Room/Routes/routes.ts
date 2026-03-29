import { Router } from "express";
import { bindController } from "../../Utils/bindController";
import { authMiddleware } from "../../Middlewares/authMiddleware";
import { validateRoomDTO } from "../Validators/RoomValidator";
import { RoomController } from "../Controller/RoomController";

const router = Router();
router.use(authMiddleware);
const roomController = bindController(new RoomController());

router.get("/", roomController.getPublicRooms);
router.get("/id/:id", roomController.getRoomById);
router.get("/private", roomController.getPrivateRooms);
router.get("/private/id/:id", roomController.getPrivateRoomById);
router.get("/invited/:id/token/:token", roomController.getInvitedRoom);
router.get("/member", roomController.getMemberRooms);
router.get("/messages/:roomId", roomController.getRoomMessages);
router.post("/create", validateRoomDTO, roomController.createRoom);
router.put("/update/:id", validateRoomDTO, roomController.editRoom);
router.delete("/delete/:id", roomController.deleteRoom);

export default router;
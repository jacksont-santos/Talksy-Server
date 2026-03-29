import { Router } from "express";
import { validateUserDTO } from "../Validators/UserValidator";
import { bindController } from "../../utils/bindController";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { UserController } from "../Controller/UserController";

const router = Router();
const userController = bindController(new UserController());

router.get("/", authMiddleware, userController.get);
router.post("/signup", validateUserDTO, userController.create);
router.put("/update", validateUserDTO, userController.update);
router.delete("/delete", authMiddleware, userController.delete);

export default router;
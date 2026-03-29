import { Router } from "express";
import { bindController } from "../../Utils/bindController";
import { AuthController } from "../Controller/AuthController";
import { validateAuthDTO } from "../Validator/AuthValidator";

const router = Router();
const authController = bindController(new AuthController());

router.post("/signin", validateAuthDTO, authController.login);

export default router;


import { Router, Request, Response } from "express";
import { AuthService } from "./userService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateUserAuthDTO } from "./userValidator";

const router = Router();
const authService = new AuthService();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const user = (<any>req.headers).userData;
  res.send({ message: "ok", data: user });
})

router.post("/signup", validateUserAuthDTO, async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const response = await authService.createUser(username, password);
  res.status(response.statusCode).send({ message: response.message, data: response.data });
});

router.post("/signin", validateUserAuthDTO, async (req: Request, res: Response) => {
  let { username, password } = req.body;  
  const response = await authService.login(username, password);
  res.status(response.statusCode).send({ message: response.message, data: response.data });
});

router.delete("/delete", authMiddleware, async (req: Request, res: Response) => {
  const userId = (<any>req.headers).userData._id;
  const response = await authService.deleteUser(userId);
  res.status(response.statusCode).send({ message: response.message, data: response.data });
});

export default router;

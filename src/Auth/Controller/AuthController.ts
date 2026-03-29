import { Request, Response } from "express";
import { AuthService } from "../Service/AuthService";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    let { username, password } = req.body;
    const data = await authService.login(username, password);
    res.status(200).send({ message: "Login successful", data });
  }
}
import { Request, Response } from "express";
import { UserService } from "../Service/UserService";

const userService = new UserService();

export class UserController {
  async get(req: Request, res: Response) {
    const userId = (<any>req.headers).userData._id;
    const user = await userService.getUserData(userId);
    res.status(200).send({ data: user });
  }

  async create(req: Request, res: Response) {
    const { username, password, nickname } = req.body;
    const user = await userService.createUser({ username, password, nickname });
    res.status(201).send({ message: "User created successfully", data: user });
  }

  async update(req: Request, res: Response) {
    const userId = (<any>req.headers).userData._id;
    const { username, password, nickname } = req.body;
    const user = await userService.editUser(userId, { username, password, nickname });
    res.status(200).send({ message: "User updated successfully", data: user });
  }

  async delete(req: Request, res: Response) {
    const userId = (<any>req.headers).userData._id;
    await userService.deleteUser(userId);
    res.status(200).send({ message: "User deleted successfully" });
  }
}
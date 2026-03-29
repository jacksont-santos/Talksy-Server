import { UserRepository } from "../Repository/UserRepository";
import { hashPassword } from "../../utils/crypto";
import { IUser } from "../Entity/User";
import { AppError } from "../../Error/AppError";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  getUserData(userId: string): Promise<IUser> {
    return this.userRepository.findById(userId);
  }

  async createUser({ username, password, nickname }: Omit<IUser, "_id">): Promise<IUser> {
    const user = await this.userRepository.findByUsername(username);
    if (user) throw new AppError(409, "Username already exists");
    password = await hashPassword(password);
    return await this.userRepository.create({ username, password, nickname });
  }

  async editUser(userId: string, userData: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found");
    return await this.userRepository.update(userId, userData);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}

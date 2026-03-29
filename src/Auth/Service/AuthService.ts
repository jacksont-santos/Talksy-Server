import { UserRepository } from "../../User/Repository/UserRepository";
import { comparePasswords } from "../../Utils/crypto";
import { signJWT } from "../../Utils/jwt";
import { IUser } from "../../User/Entity/User";
import { AppError } from "../../Error/AppError";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(username: string, password: string): Promise<{ token: string; _id: string; username: string; nickname: string }> {

    const user = await this.userRepository.findByUsername(username, true) as IUser;
    if (!user) throw new AppError(401, "Invalid username or password");

    const result = comparePasswords(password, user.password);
    if (!result) throw new AppError(401, "Invalid username or password");

    const token = signJWT({
      _id: user._id,
      nickname: user.nickname,
      date: new Date() 
    });
    if (!token) throw new AppError(500, "Internal server error");

    return {
      token, 
      _id: user._id,
      username: user.username,
      nickname: user.nickname
    };
  }
}

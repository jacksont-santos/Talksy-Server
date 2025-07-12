import { userModel } from "../database/models";
import { hashPassword, comparePasswords } from "../utils/crypto";
import { signJWT } from "../utils/jwt";
import { httpResponse } from "../utils/response";

export class AuthService {
  async createUser(username: string, password: string): Promise<httpResponse> {

    const user = await userModel.findOne({ username });
    if (user) return {statusCode: 409,  message: "Username already exists"};

    password = await hashPassword(password);
    const newUser = await userModel.create({ username, password });
    return {statusCode: 201, message: "User created successfully", data: newUser._id}
  }

  async login(username: string, password: string): Promise<httpResponse> {

    const user =await userModel.findOne({ username });
    if (!user) return {statusCode: 401, message: "Invalid username or password"};

    const result = comparePasswords(password, user.password);
    if (!result) return {statusCode: 401, message: "Invalid username or password"};

    const token = signJWT({ username, _id: user._id});
    if (!token) return {statusCode: 500, message: "Internal server error"};

    return {
      statusCode: 200,
      message: "Login successful",
      data: {
        _id: user._id,
        username: user.username,
        token,
      }
    };
  }

  async deleteUser(userId: string): Promise<httpResponse> {
    await userModel.deleteOne({ _id: userId });
    return {statusCode: 200, message: "Account deleted successfully"};
  }
}

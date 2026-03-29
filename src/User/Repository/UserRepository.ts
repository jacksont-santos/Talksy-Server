import { UserModel, IUser } from "./../Entity/User";

export class UserRepository {
  async findByUsername(username: string, password: boolean = true): Promise<IUser | Omit<IUser, "password"> | null> {
    return await UserModel.findOne({ username }, { _id: 1, username: 1, nickname: 1, password: password ? 1 : 0 }).lean();
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).lean();
  }

  async create(userData: Omit<IUser, "_id">): Promise<IUser> {
    const newUser = await UserModel.create(userData);
    return newUser.toObject();
  }

  async update(userId: string, userData: Partial<IUser>): Promise<IUser> {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, { new: true }).lean();
    return updatedUser;
  }

  async delete(userId: string): Promise<void> {
    await UserModel.deleteOne({ _id: userId });
  }
}

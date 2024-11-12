import { ObjectId } from "mongoose";
import UserModel, { User } from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";

interface ILoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: ILoginPayload): Promise<string> => {
  const { email, password } = payload;
  const userByEmail = await UserModel.findOne({
    email,
  });

  if (!userByEmail) {
    return Promise.reject(new Error("email: user not found"));
  }
  const validatePassword: boolean = encrypt(password) === userByEmail.password;

  if (!validatePassword) {
    return Promise.reject(new Error("password: user not found"));
  }

  const token = generateToken({
    id: userByEmail.id,
    roles: userByEmail.roles,
  });

  return token;
};

interface IRegisterPayload {
  email: string;
  fullName: string;
  username: string;
  password: string;
  roles: (string | undefined)[] | undefined;
}
export const register = async (payload: IRegisterPayload): Promise<User> => {
  const { email, fullName, username, password, roles } = payload;
  const user = await UserModel.create({
    email,
    fullName,
    password,
    username,
    roles,
  });

  return user;
};

export const me = async (userId: string): Promise<User> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    return Promise.reject(new Error("user not found"));
  }
  return user;
};
export const updateProfile = async (userId: ObjectId, updateUserData: User) => {
  const result = await UserModel.findByIdAndUpdate(
    userId,
    {
      ...updateUserData,
    },
    {
      new: true,
    }
  );
  if (!result) {
    return Promise.reject(new Error("failed update user"));
  }
  return result;
};

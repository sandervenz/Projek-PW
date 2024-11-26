import { ObjectId } from "mongoose";
import UserModel, { User } from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";

interface ILoginPayload {
  username: string;
  password: string;
}

export const login = async (payload: ILoginPayload): Promise<string> => {
  const { username, password } = payload;

  // Find user by username
  const user = await UserModel.findOne({ username });

  if (!user) {
    return Promise.reject(new Error("username: user not found"));
  }

  // Validate password
  const validatePassword: boolean = encrypt(password) === user.password;

  if (!validatePassword) {
    return Promise.reject(new Error("password: invalid credentials"));
  }

  // Generate token
  const token = generateToken({
    id: user.id
  });

  return token;
};

interface IRegisterPayload {
  username: string;
  password: string;
}

export const register = async (payload: IRegisterPayload): Promise<User> => {
  const { username, password } = payload;

  // Create new user
  const user = await UserModel.create({
    username,
    password,
  });

  return user;
};

export const me = async (userId: string): Promise<User> => {
  // Fetch user profile
  const user = await UserModel.findById(userId);
  if (!user) {
    return Promise.reject(new Error("user not found"));
  }
  return user;
};

export const updateProfile = async (userId: ObjectId, updateUserData: Partial<User>) => {
  // Update user profile
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

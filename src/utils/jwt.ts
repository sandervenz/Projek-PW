import jwt from "jsonwebtoken";
import { SECRET } from "./env";
import { ObjectId } from 'mongoose';

export interface IUserToken {
  id: ObjectId;
  roles: string[];
}

// Fungsi untuk menghasilkan token JWT
export const generateToken = (payload: IUserToken): string => {
  return jwt.sign(payload, SECRET);
};

// Fungsi untuk memvalidasi dan mendapatkan data dari token JWT
export const getUserData = (token: string): IUserToken | null => {
  try {
    const decoded = jwt.verify(token, SECRET) as IUserToken;
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

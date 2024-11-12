import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: ObjectId;
        roles: string[];
      };
    }
  }
}

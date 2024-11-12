import { NextFunction, Request, Response } from "express";
import { getUserData, IUserToken } from "../utils/jwt";

export interface IRequestWithUser extends Request {
  user?: IUserToken;
}

const authMiddleware = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return res.status(403).json({
      message: "unauthorized0",
      data: null,
    });
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return res.status(403).json({
      message: "unauthorized1",
      data: null,
    });
  }

  const user = getUserData(token);

  if (!user) {
    return res.status(403).json({
      message: "unauthorized2",
      data: null,
    });
  }

  (req as IRequestWithUser).user = user;

  next();
};

export default authMiddleware;

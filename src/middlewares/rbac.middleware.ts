import { Request, Response, NextFunction, RequestHandler } from "express";
import { IRequestWithUser } from "./auth.middleware";

const rbacMiddleware = (roles: string[]): RequestHandler => {
  return (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles;

    if (!userRoles || !userRoles.some((userRole) => roles.includes(userRole))) {
      return res.status(403).json({
        message: "You are a User",
      });
    }

    next();
  };
};

export default rbacMiddleware;

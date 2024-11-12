import { Request, Response } from "express";

import UserModel, { User } from "../models/user.model";
import { IRequestWithUser } from "../middlewares/auth.middleware";

import * as Yup from "yup";
import { login, register, updateProfile } from "../services/auth.service";
import { ObjectId } from "mongoose";

const registerSchema = Yup.object().shape({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), ""],
      "Passwords must match"
    ),
    roles: Yup.array().of(Yup.string()).optional(),
  });
  
  const loginSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });
  
  type TLoginBody = Yup.InferType<typeof loginSchema>;
  type TRegisterBody = Yup.InferType<typeof registerSchema>;
  
  interface IRequestLogin extends Request {
    body: TLoginBody;
  }
  
  interface IRequestRegister extends Request {
    body: TRegisterBody;
  }  

export default {
    async login(req: IRequestLogin, res: Response) {
      /**
       #swagger.tags = ['Auth']
       #swagger.requestBody = {
        required: true,
        schema: {
          $ref: "#/components/schemas/LoginRequest"
        }
      }
      */
      try {
        const { email, password } = req.body;
        await loginSchema.validate({ email, password });
        const token = await login({ email, password });
        res.status(200).json({
          message: "login success",
          data: token,
        });
      } catch (error) {
        const err = error as Error;
        res.status(500).json({
          data: null,
          message: err.message,
        });
      }
    },
    async register(req: IRequestRegister, res: Response) {
      /**
       #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        schema: {
          $ref: "#/components/schemas/RegisterRequest"
        }
      }
      */    
      try {
        const { email, fullName, password, username, confirmPassword, roles } =
          req.body;
  
        await registerSchema.validate({
          email,
          fullName,
          password,
          username,
          confirmPassword,
          roles,
        });
  
        const user = await register({
          email,
          fullName,
          username,
          password,
          roles,
        });
  
        res.status(200).json({
          message: "registration success!",
          data: user,
        });
      } catch (error) {
        const err = error as Error;
        res.status(500).json({
          data: err.message,
          message: "Failed register",
        });
      }
    },
    async me(req: IRequestWithUser, res: Response) {
      /**
       #swagger.tags = ['Auth']
      #swagger.security = [{
        "bearerAuth": []
      }]
      */    
      try {
        const id = req.user?.id;
        const user = await UserModel.findById(id);
        if (!user) {
          return res.status(403).json({
            message: "user not found",
            data: null,
          });
        }
  
        res.status(200).json({
          message: "success fetch user profile",
          data: user,
        });
      } catch (error) {
        const err = error as Error;
        res.status(500).json({
          data: err.message,
          message: "Failed get user profile",
        });
      }
    },
    async profile(req: IRequestWithUser, res: Response) {
      /**
       #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/UpdateProfileRequest"}
      }
      #swagger.security = [{
        "bearerAuth": []
      }]
      */    
      try {
        const id = req.user?.id;
        const result = await updateProfile(
          id as unknown as ObjectId,
          req.body as User
        );
        res.status(200).json({
          message: "Profile updated successfully",
          data: result,
        });
      } catch (error) {
        const err = error as Error;
        res.status(500).json({
          data: err.message,
          message: "Failed update user profile",
        });
      }
    },
  };
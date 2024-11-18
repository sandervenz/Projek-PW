import { Request, Response } from "express";

import UserModel, { User } from "../models/user.model";
import { IRequestWithUser } from "../middlewares/auth.middleware";

import * as Yup from "yup";
import { login, register, updateProfile } from "../services/auth.service";
import { ObjectId } from "mongoose";

const registerSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    telp: Yup.number().required(),
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
        const { email, name, telp } =
          req.body;
  
        await registerSchema.validate({
          email,
          name,
          telp,
        });
  
        const user = await register({
          email,
          name,
          telp,
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
}
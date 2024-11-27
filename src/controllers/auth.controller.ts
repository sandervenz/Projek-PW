import { Request, Response } from "express";

import * as Yup from "yup";
import { login, register } from "../services/auth.service";

const registerSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

const loginSchema = Yup.object({
  username: Yup.string().required(),
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
      const { username, password } = req.body;
      await loginSchema.validate({ username, password });
      const token = await login({ username, password });
      res.status(200).json({
        message: "login success",
        data: token,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: null,
        message: "Username or Password are invalid",
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
      const { username, password } = req.body;

      await registerSchema.validate({
        username,
        password,
      });

      const user = await register({
        username,
        password,
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
};

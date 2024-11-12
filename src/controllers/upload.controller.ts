import { Request, Response } from "express";
import { toDataURI } from "../utils/encode";
import { handleUpload } from "../utils/cloudinary";

export default {
  async single(req: Request, res: Response) {
    /**
     #swagger.tags = ['Media']
     #swagger.security = [{
      "bearerAuth": []
     }]
     #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary"
              }
            }
          }
        }
      }
     }
     */  
    if (req?.file === undefined) {
      return res.status(400).send({
        message: "No file uploaded",
        data: null,
      });
    }
    const dataURI = toDataURI(req.file);

    try {
      const result = await handleUpload(dataURI);
      res.status(200).send({ message: "File uploaded", data: result });
    } catch (error) {
      const _err = error as Error;
      res
        .status(400)
        .send({ message: "Error uploading file", data: _err.message });
    }
  },

  async multiple(req: Request, res: Response) {
    /**
     #swagger.tags = ['Media']
     #swagger.security = [{
      "bearerAuth": []
     }]
     #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              files: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          }
        }
      }
     }
     */ 
    if (req.files === undefined || req.files?.length === 0) {
      return res.status(400).send({
        message: "No files uploaded",
        data: null,
      });
    }
    const files = req.files as Express.Multer.File[];

    const dataURIs = files
      ?.map((file: Express.Multer.File) => toDataURI(file))
      .map(handleUpload);

    try {
      const results = await Promise.all(dataURIs);
      res.status(200).send({ message: "Files uploaded", data: results });
    } catch (error) {
      const _err = error as Error;
      res
        .status(400)
        .send({ message: "Error uploading files", data: _err.message });
    }

    res.status(200).send({ message: "Files uploaded", data: files });
  },
};

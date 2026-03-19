import { NextFunction, Request, Response } from "express";

import { uploadFileToCloudinary } from "../services/upload.service";
import { AppError } from "../utils/appError";

interface UploadResponse {
  url: string;
}

export async function uploadMediaFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.file) {
    next(new AppError("File is required in form-data field 'file'", 400));
    return;
  }

  try {
    const secureUrl: string = await uploadFileToCloudinary(req.file.buffer);
    const responsePayload: UploadResponse = { url: secureUrl };

    res.status(201).json(responsePayload);
  } catch (error: unknown) {
    next(error);
  }
}

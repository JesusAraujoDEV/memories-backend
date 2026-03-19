import { UploadApiResponse } from "cloudinary";

import { cloudinary } from "../config/cloudinary";
import { AppError } from "../utils/appError";

export async function uploadFileToCloudinary(fileBuffer: Buffer): Promise<string> {
  if (fileBuffer.length === 0) {
    throw new AppError("Uploaded file is empty", 400);
  }

  const secureUrl: string = await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(new AppError("Failed to upload file to Cloudinary", 502));
          return;
        }

        if (!result?.secure_url) {
          reject(new AppError("Cloudinary response did not include secure_url", 502));
          return;
        }

        resolve(result.secure_url);
      },
    );

    uploadStream.end(fileBuffer);
  });

  return secureUrl;
}

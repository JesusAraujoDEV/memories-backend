import multer, { Multer } from "multer";

const upload: Multer = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadSingleFile = upload.single("file");

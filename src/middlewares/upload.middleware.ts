import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export const single = upload.single("file");
export const multiple = upload.array("files", 10);

export default {
  single,
  multiple,
};

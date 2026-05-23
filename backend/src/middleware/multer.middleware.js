import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
 filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const filename =
    Date.now() + ext;
  cb(null, filename);
},
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, png and webp images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;

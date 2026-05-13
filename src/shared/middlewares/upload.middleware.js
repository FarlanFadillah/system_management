import multer from "multer";
import { v4 } from "uuid";
import createDebug from "debug";
import path from "path";
const debug = createDebug("app:middleware:upload");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        debug("file :", file);
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        const filename = v4() + path.extname(file.originalname);
        debug("file name is", filename);
        cb(null, filename);
    },
});

export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        debug("file mime type is", file.mimetype);
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

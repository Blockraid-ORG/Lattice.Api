import { diskStorage } from 'multer';
import { extname } from 'path';
const MAXSIZE = 5 * 1024 * 1024;

export const localMulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, fileName);
    },
  }),
  limits: {
    fileSize: MAXSIZE,
  },
};

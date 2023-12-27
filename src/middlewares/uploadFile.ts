import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const productStorage = multer.diskStorage({
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname
    cb(null, uniqueSuffix)
  },
})

const fileFilter = (request: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedType = ['image/jpeg', 'image/png', 'image/jpg']
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error(`File is not image`))
  }
  if (!allowedType.includes(file.mimetype)) {
    return cb(new Error(`Only upload images this type: ${file.mimetype} not allowed`))
  }
  cb(null, true)
}

export const upload = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 1 },
})

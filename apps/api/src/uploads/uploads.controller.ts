import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { randomUUID } from 'crypto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UPLOADS_DIR } from './uploads.constants'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
]
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024 // 15MB

@Controller('uploads')
export class UploadsController {
  /** POST /api/uploads — multipart field name must be "file" */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`)
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(new BadRequestException('Only images, PDF, and audio files are allowed'), false)
          return
        }
        cb(null, true)
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded')
    }
    return { url: `/uploads/${file.filename}` }
  }
}

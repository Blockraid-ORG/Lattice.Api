import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { localMulterOptions } from './multer.config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post('upload/local')
  @UseInterceptors(FileInterceptor('file', localMulterOptions))
  uploadFileLocal(@UploadedFile() file: Express.Multer.File) {
    const data = {
      originalname: file.originalname,
      mimetype: file.mimetype,
      filename: file.filename,
      path: file.path,
      size: file.size,
    };
    return this.filesService.uploadFileLocal(data);
  }
}

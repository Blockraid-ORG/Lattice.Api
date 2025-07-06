import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}
  uploadFileLocal(data: CreateFileDto) {
    return this.prisma.fileLog.create({ data });
  }
}

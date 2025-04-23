import { UploadDTO } from '@/contracts/upload.dto';
import { UploadService } from '@/services/upload.service';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post("/")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: UploadDTO) {
    return this.uploadService.upload(file)
  }
}

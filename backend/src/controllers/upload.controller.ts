import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadDTO } from '@/contracts/upload.dto';
import { UploadService } from '@/services/upload.service';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  /**
   * Upload de arquivo
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.upload(file);
  }

  /**
   * Gerar URL pública para visualização
   */
  @Get(':filename')
  async getFileUrl(@Param('filename') filename: string) {
    return await this.uploadService.getFile(filename);
  }

  /**
   * Fazer download de arquivo via Stream
   */
  @Get('download/:fileKey')
  async downloadFile(@Param('fileKey') fileKey: string, @Res() res: Response) {
    return await this.uploadService.download(fileKey);
  }

  /**
   * Deletar arquivo
   */
  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    return await this.uploadService.delete(filename);
  }
}

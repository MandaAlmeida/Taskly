import { UploadController } from '@/controllers/upload.controller';
import { EnvModule } from '@/env/env.module';
import { EnvService } from '@/env/env.service';
import { UploadService } from '@/services/upload.service';
import { Module } from '@nestjs/common';


@Module({
  imports: [EnvModule],
  controllers: [UploadController],
  providers: [UploadService, EnvService],
  exports: [UploadService]
})
export class UploadModule { }

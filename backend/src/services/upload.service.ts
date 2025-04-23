import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { EnvService } from "@/env/env.service";
import { UploadDTO } from "@/contracts/upload.dto";
import { Upload } from "@aws-sdk/lib-storage";


@Injectable()
export class UploadService {
    private client: S3Client

    constructor(
        private envService: EnvService
    ) {
        const accountId = envService.get("CLOUDFLARE_ACCOUNT_ID")

        this.client = new S3Client({
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            region: "auto",
            credentials: {
                accessKeyId: envService.get("AWS_ACCESS_KEY_ID"),
                secretAccessKey: envService.get("AWS_SECRET_ACCESS_KEY")
            }

        })
    }

    async getFile(fileName: string) {
        const url = this.envService.get("URL_PUBLIC_GET_IMAGE")

        const fileURL = `${url}${fileName}`

        return fileURL
    }


    async upload(file: UploadDTO) {
        const uploadId = randomUUID()
        const uniqueFileName = `${uploadId}-${file.originalname}`

        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: this.envService.get("AWS_BUCKET_NAME"),
                Key: uniqueFileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            },
        });

        await upload.done();

        return {
            title: file.originalname,
            url: uniqueFileName
        }

    }

    async delete(file: string): Promise<{ success: boolean }> {
        const command = new DeleteObjectCommand({
            Bucket: this.envService.get("AWS_BUCKET_NAME"),
            Key: file,
        })
        await this.client.send(command);
        return { success: true };
    }

}

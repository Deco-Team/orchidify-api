import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { GenerateSignedUrlDto } from '@media/dto/generate-signed-url.dto';
import { UploadMediaViaBase64Dto } from '@media/dto/upload-media-via-base64.dto';
export declare class MediaService implements OnModuleInit {
    private readonly configService;
    private readonly cloudinary;
    private readonly appLogger;
    constructor(configService: ConfigService, cloudinary: typeof v2);
    onModuleInit(): void;
    create(generateSignedUrlDto: GenerateSignedUrlDto): Promise<{
        timestamp: number;
        signature: string;
        type: string;
        public_id: string;
        folder: string;
        source: "uw";
        upload_preset: string;
    }>;
    uploadViaBase64(uploadMediaViaBase64Dto: UploadMediaViaBase64Dto): Promise<import("cloudinary").UploadApiResponse>;
    private generateSignedUrl;
    uploadMultiple(images: string[]): Promise<any[]>;
}

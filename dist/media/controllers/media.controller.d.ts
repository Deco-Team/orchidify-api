import { MediaService } from '@media/services/media.service';
import { GenerateSignedUrlDto } from '@media/dto/generate-signed-url.dto';
import { UploadMediaViaBase64Dto } from '@media/dto/upload-media-via-base64.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    generateSignedURL(generateSignedUrlDto: GenerateSignedUrlDto): Promise<{
        timestamp: number;
        signature: string;
        type: string;
        public_id: string;
        folder: string;
        source: "uw";
        upload_preset: string;
    }>;
    uploadViaBase64(uploadMediaViaBase64Dto: UploadMediaViaBase64Dto): Promise<import("cloudinary").UploadApiResponse>;
}

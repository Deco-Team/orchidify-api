import { EmailDto } from '@common/dto/email.dto';
export declare class BaseCertificateDto extends EmailDto {
    _id: string;
    name?: string;
    code: string;
    url: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

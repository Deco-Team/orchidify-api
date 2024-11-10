import { InstructorStatus } from '@common/contracts/constant';
import { EmailDto } from '@common/dto/email.dto';
export declare class InstructorCertificateDto {
    name: string;
    url: string;
}
export declare class PaymentInfoDto {
    bankName: string;
    bankShortName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
}
export declare class BaseInstructorDto extends EmailDto {
    _id: string;
    name: string;
    password: string;
    phone: string;
    dateOfBirth: Date;
    certificates: InstructorCertificateDto[];
    bio: string;
    idCardPhoto: string;
    avatar: string;
    status: InstructorStatus;
    balance: number;
    paymentInfo: PaymentInfoDto;
    createdAt: Date;
    updatedAt: Date;
}

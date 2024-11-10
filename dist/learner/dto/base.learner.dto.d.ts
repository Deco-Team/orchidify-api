import { LearnerStatus } from '@common/contracts/constant';
import { EmailDto } from '@common/dto/email.dto';
export declare class BaseLearnerDto extends EmailDto {
    _id: string;
    name: string;
    password: string;
    avatar: string;
    dateOfBirth: Date;
    phone: string;
    status: LearnerStatus;
    createdAt: Date;
    updatedAt: Date;
}

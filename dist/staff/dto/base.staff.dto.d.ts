import { StaffStatus } from '@common/contracts/constant';
import { EmailDto } from '@common/dto/email.dto';
export declare class BaseStaffDto extends EmailDto {
    _id: string;
    name: string;
    staffCode: string;
    password: string;
    idCardPhoto: string;
    status: StaffStatus;
    role: StaffStatus;
    createdAt: Date;
    updatedAt: Date;
}

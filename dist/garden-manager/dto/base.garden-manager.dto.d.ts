import { GardenManagerStatus } from '@common/contracts/constant';
import { EmailDto } from '@common/dto/email.dto';
export declare class BaseGardenManagerDto extends EmailDto {
    _id: string;
    name: string;
    password: string;
    idCardPhoto: string;
    avatar: string;
    status: GardenManagerStatus;
    createdAt: Date;
    updatedAt: Date;
}

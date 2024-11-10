import { UserRole } from '@common/contracts/constant';
import { EmailDto } from '@common/dto/email.dto';
export declare class LoginDto extends EmailDto {
    password: string;
}
export declare class ManagementLoginDto extends LoginDto {
    role: UserRole;
}

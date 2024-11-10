import { EmailDto } from '@common/dto/email.dto';
export declare class InstructorRegisterDto extends EmailDto {
    name: string;
    phone: string;
    cv: string;
    note: string;
}

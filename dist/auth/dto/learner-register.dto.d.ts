import { EmailDto } from '@common/dto/email.dto';
import { BaseLearnerDto } from '@learner/dto/base.learner.dto';
declare const LearnerRegisterDto_base: import("@nestjs/common").Type<Pick<BaseLearnerDto, "name" | "email" | "password">>;
export declare class LearnerRegisterDto extends LearnerRegisterDto_base {
}
export declare class LearnerVerifyAccountDto extends EmailDto {
    code: string;
}
export declare class LearnerResendOtpDto extends EmailDto {
}
export {};

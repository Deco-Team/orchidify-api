import { BaseClassRequestDto } from './base.class-request.dto';
import { SlotNumber, Weekday } from '@common/contracts/constant';
declare const CreatePublishClassRequestDto_base: import("@nestjs/common").Type<Pick<BaseClassRequestDto, "description" | "courseId">>;
export declare class CreatePublishClassRequestDto extends CreatePublishClassRequestDto_base {
    startDate: Date;
    weekdays: Weekday[];
    slotNumbers: SlotNumber[];
}
export {};

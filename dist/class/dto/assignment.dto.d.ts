import { BaseMediaDto } from '@media/dto/base-media.dto';
export declare class BaseAssignmentDto {
    _id: string;
    title: string;
    description: string;
    attachments: BaseMediaDto[];
}
declare const CreateAssignmentDto_base: import("@nestjs/common").Type<Pick<BaseAssignmentDto, "attachments" | "title" | "description">>;
export declare class CreateAssignmentDto extends CreateAssignmentDto_base {
}
export {};

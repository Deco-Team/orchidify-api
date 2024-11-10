import { BaseCourseDto } from './base.course.dto';
declare const UpdateCourseComboDto_base: import("@nestjs/common").Type<Pick<BaseCourseDto, "childCourseIds" | "discount">>;
export declare class UpdateCourseComboDto extends UpdateCourseComboDto_base {
    title: string;
    description: string;
}
export {};

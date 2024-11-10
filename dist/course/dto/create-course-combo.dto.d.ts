import { BaseCourseDto } from './base.course.dto';
declare const CreateCourseComboDto_base: import("@nestjs/common").Type<Pick<BaseCourseDto, "childCourseIds" | "discount">>;
export declare class CreateCourseComboDto extends CreateCourseComboDto_base {
    title: string;
    description: string;
}
export {};

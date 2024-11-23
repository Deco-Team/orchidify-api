import { PaginationParams } from '@common/decorators/pagination.decorator';
import { ICourseService } from '@course/services/course.service';
import { PublicQueryCourseDto } from '@course/dto/view-course.dto';
import { Course } from '@course/schemas/course.schema';
import { ILearnerClassService } from '@class/services/learner-class.service';
export declare class CourseController {
    private readonly courseService;
    private readonly learnerClassService;
    constructor(courseService: ICourseService, learnerClassService: ILearnerClassService);
    list(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto): Promise<any>;
    listForLearner(req: any, pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto): Promise<any>;
    getDetail(req: any, courseId: string): Promise<Course & Required<{
        _id: string;
    }>>;
}

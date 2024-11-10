import { CourseStatus } from '@common/contracts/constant';
import { BaseMediaDto } from '@media/dto/base-media.dto';
import { CourseLevel } from '@src/common/contracts/constant';
import { BaseSessionDto } from '@class/dto/session.dto';
import { BaseRatingSummaryDto } from '@class/dto/rating-summary.dto';
export declare class BaseCourseDto {
    _id: string;
    code: string;
    title: string;
    description: string;
    price: number;
    level: CourseLevel;
    type: string[];
    duration: number;
    thumbnail: string;
    media: BaseMediaDto[];
    status: CourseStatus;
    sessions: BaseSessionDto[];
    learnerLimit: number;
    rate: number;
    discount: number;
    gardenRequiredToolkits: string;
    instructorId: string;
    isRequesting: Boolean;
    ratingSummary: BaseRatingSummaryDto;
    createdAt: Date;
    updatedAt: Date;
}

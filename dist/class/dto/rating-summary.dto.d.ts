export declare class BaseRatingTotalCountByRateDto {
    constructor();
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
}
export declare class BaseRatingSummaryDto {
    constructor(totalSum: number, totalCount: number, totalCountByRate: BaseRatingTotalCountByRateDto);
    totalSum: number;
    totalCount: number;
    totalCountByRate: BaseRatingTotalCountByRateDto;
}

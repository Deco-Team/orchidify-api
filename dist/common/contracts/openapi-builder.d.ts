import { ApiPropertyOptions } from "@nestjs/swagger";
import { ClassConstructor } from "class-transformer";
export declare function PaginateResponse<TDoc extends ClassConstructor<any>>(Doc: TDoc, options?: ApiPropertyOptions | undefined): import("@nestjs/common").Type<{
    docs: (typeof Doc)[];
    totalDocs: number;
    offset: number;
    limit: number;
    totalPages: number;
    page?: number | undefined;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage?: number | null | undefined;
    nextPage?: number | null | undefined;
}>;
export declare function DataResponse<TDoc extends ClassConstructor<any>>(Doc: TDoc, options?: ApiPropertyOptions | undefined): import("@nestjs/common").Type<{
    data: typeof Doc;
}>;

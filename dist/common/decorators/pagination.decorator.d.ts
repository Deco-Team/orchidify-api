export interface PaginationParams {
    page: number;
    limit: number;
    sort: Record<string, any>;
}
export declare const handlePagination: (request: any) => PaginationParams;
export declare const Pagination: (...dataOrPipes: unknown[]) => ParameterDecorator;

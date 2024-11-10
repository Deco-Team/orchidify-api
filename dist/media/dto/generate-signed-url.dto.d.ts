export declare class GenerateSignedUrlDto {
    type: string;
    public_id: string;
    folder: string;
    source: 'uw';
    upload_preset: string;
}
declare class GenerateSignedUrlResponse extends GenerateSignedUrlDto {
    timestamp: string;
    signature: string;
}
declare const GenerateSignedUrlDataResponse_base: import("@nestjs/common").Type<{
    data: typeof GenerateSignedUrlResponse;
}>;
export declare class GenerateSignedUrlDataResponse extends GenerateSignedUrlDataResponse_base {
}
export {};

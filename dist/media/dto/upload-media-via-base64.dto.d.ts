export declare class UploadMediaViaBase64Dto {
    contents: string;
    type: string;
    public_id: string;
    folder: string;
}
declare class UploadMediaViaBase64ResponseDto {
    asset_id: string;
    public_id: string;
    format: string;
    resource_type: string;
    created_at: string;
    type: string;
    url: string;
    asset_folder: string;
}
declare const UploadMediaViaBase64DataResponseDto_base: import("@nestjs/common").Type<{
    data: typeof UploadMediaViaBase64ResponseDto;
}>;
export declare class UploadMediaViaBase64DataResponseDto extends UploadMediaViaBase64DataResponseDto_base {
}
export {};

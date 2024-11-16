/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { UserDeviceStatus, UserRole } from '@common/contracts/constant';
import { Types } from 'mongoose';
export declare class BaseUserDeviceDto {
    _id: string;
    userId: Types.ObjectId;
    userRole: UserRole;
    fcmToken: string;
    browser: string;
    os: string;
    status: UserDeviceStatus;
    createdAt: Date;
    updatedAt: Date;
}
declare const CreateUserDeviceDto_base: import("@nestjs/common").Type<Pick<BaseUserDeviceDto, "fcmToken" | "browser" | "os">>;
export declare class CreateUserDeviceDto extends CreateUserDeviceDto_base {
    userId: Types.ObjectId;
    userRole: UserRole;
}
declare const UserDeviceDetailResponse_base: import("@nestjs/common").Type<Pick<BaseUserDeviceDto, "status" | "createdAt" | "updatedAt" | "_id" | "userId" | "userRole" | "fcmToken" | "browser" | "os">>;
declare class UserDeviceDetailResponse extends UserDeviceDetailResponse_base {
}
declare const UserDeviceDetailDataResponse_base: import("@nestjs/common").Type<{
    data: typeof UserDeviceDetailResponse;
}>;
export declare class UserDeviceDetailDataResponse extends UserDeviceDetailDataResponse_base {
}
export {};

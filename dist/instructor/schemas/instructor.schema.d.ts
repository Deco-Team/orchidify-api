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
import { HydratedDocument } from 'mongoose';
import { InstructorStatus } from '@common/contracts/constant';
import { InstructorCertificateDto, PaymentInfoDto } from '@instructor/dto/base.instructor.dto';
export type InstructorDocument = HydratedDocument<Instructor>;
export declare class Instructor {
    constructor(id?: string);
    _id: string;
    name: string;
    password: string;
    phone: string;
    email: string;
    dateOfBirth: Date;
    certificates: InstructorCertificateDto[];
    bio: string;
    idCardPhoto: string;
    avatar: string;
    status: InstructorStatus;
    balance: number;
    paymentInfo: PaymentInfoDto;
}
export declare const InstructorSchema: import("mongoose").Schema<Instructor, import("mongoose").Model<Instructor, any, any, any, import("mongoose").Document<unknown, any, Instructor> & Instructor & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Instructor, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Instructor>> & import("mongoose").FlatRecord<Instructor> & Required<{
    _id: string;
}>>;

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
import { Connection, ClientSession } from 'mongoose';
import { Weekday } from '@common/contracts/constant';
export type GeneratePDFResponse = {
    status: boolean;
    certificatePath: string;
    metadata: object;
    error?: string;
};
export declare class HelperService {
    private readonly connection;
    private readonly appLogger;
    constructor(connection: Connection);
    executeCommandsInTransaction(fn: (session: ClientSession, data?: Record<string, any>) => Promise<any>, data?: Record<string, any>): Promise<any>;
    createSignature(rawData: string, key: string): string;
    generateRandomString: (length?: number, characters?: string) => string;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    validateWeekdays(weekdays: Weekday[]): boolean;
    convertDataToPaging({ docs, totalDocs, limit, page }: {
        docs: Array<any>;
        totalDocs: number;
        limit: number;
        page: number;
    }): {
        docs: any[];
        totalDocs: number;
        limit: number;
        page: number;
        totalPages: number;
        pagingCounter: any;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number;
        nextPage: number;
    };
    getDiffTimeByMilliseconds(date: Date): number;
    generatePDF(params: {
        data: {
            learnerName: string;
            courseTitle: string;
            dateCompleted: string;
            certificateCode: string;
            instructorName: string;
            instructorSignature?: string;
        };
        templatePath?: string;
        certificatePath?: string;
        metadata?: object;
    }): Promise<GeneratePDFResponse>;
}

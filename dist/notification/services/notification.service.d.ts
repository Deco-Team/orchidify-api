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
import { INotificationRepository } from '@notification/repositories/notification.repository';
import { Notification, NotificationDocument } from '@notification/schemas/notification.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { CreateNotificationDto } from '@notification/dto/create-notification.dto';
import { IFirebaseAuthService } from '@firebase/services/firebase.auth.service';
export declare const INotificationService: unique symbol;
export interface INotificationService {
    create(createNotificationDto: CreateNotificationDto, options?: SaveOptions | undefined): Promise<NotificationDocument>;
    findById(notificationId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<NotificationDocument>;
    findOneBy(conditions: FilterQuery<Notification>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<NotificationDocument>;
    findMany(conditions: FilterQuery<NotificationDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<NotificationDocument[]>;
    update(conditions: FilterQuery<Notification>, payload: UpdateQuery<Notification>, options?: QueryOptions | undefined): Promise<NotificationDocument>;
}
export declare class NotificationService implements INotificationService {
    private readonly notificationRepository;
    private readonly firebaseService;
    private readonly appLogger;
    constructor(notificationRepository: INotificationRepository, firebaseService: IFirebaseAuthService);
    create(createNotificationDto: CreateNotificationDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Notification>, payload: UpdateQuery<Notification>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: string;
    }>, never>>;
    findById(notificationId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: string;
    }>>;
    findOneBy(conditions: FilterQuery<Notification>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: string;
    }>>;
    findMany(conditions: FilterQuery<NotificationDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: string;
    }>)[]>;
}

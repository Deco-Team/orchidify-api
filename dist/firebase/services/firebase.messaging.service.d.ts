import { IFirebaseRepository } from '@firebase/repositories/firebase.repository';
import { IInstructorService } from '@instructor/services/instructor.service';
import { ILearnerService } from '@learner/services/learner.service';
import { SendFirebaseMessagingDto, SendFirebaseMulticastMessagingDto, SendFirebaseTopicMessagingDto } from '@firebase/dto/firebase-messaging.dto';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
export declare const IFirebaseMessagingService: unique symbol;
export interface IFirebaseMessagingService {
    send({ token, title, body, icon }: SendFirebaseMessagingDto): Promise<{
        success: boolean;
        response?: string;
    }>;
    sendMulticast({ tokens, title, body, icon }: SendFirebaseMulticastMessagingDto): Promise<{
        success: boolean;
        response?: BatchResponse;
    }>;
    sendTopicNotification({ topic, title, body, icon }: SendFirebaseTopicMessagingDto): Promise<{
        success: boolean;
        response?: string;
    }>;
}
export declare class FirebaseMessagingService implements IFirebaseMessagingService {
    private readonly firebaseRepository;
    private readonly instructorService;
    private readonly learnerService;
    private readonly appLogger;
    constructor(firebaseRepository: IFirebaseRepository, instructorService: IInstructorService, learnerService: ILearnerService);
    send({ token, title, body, icon }: SendFirebaseMessagingDto): Promise<{
        success: boolean;
        response: string;
    } | {
        success: boolean;
        response?: undefined;
    }>;
    sendMulticast({ tokens, title, body, icon }: SendFirebaseMulticastMessagingDto): Promise<{
        success: boolean;
        response: BatchResponse;
    } | {
        success: boolean;
        response?: undefined;
    }>;
    sendTopicNotification({ topic, title, body, icon }: SendFirebaseTopicMessagingDto): Promise<{
        success: boolean;
        response: string;
    } | {
        success: boolean;
        response?: undefined;
    }>;
}

import { IFirebaseRepository } from '@firebase/repositories/firebase.repository';
import { SendFirebaseMessagingDto, SendFirebaseMulticastMessagingDto, SendFirebaseTopicMessagingDto, SubscribeFirebaseTopicDto } from '@firebase/dto/firebase-messaging.dto';
import { BatchResponse, MessagingTopicManagementResponse } from 'firebase-admin/lib/messaging/messaging-api';
export declare const IFirebaseMessagingService: unique symbol;
export interface IFirebaseMessagingService {
    send({ token, title, body, data }: SendFirebaseMessagingDto): Promise<{
        success: boolean;
        response?: string;
    }>;
    sendMulticast({ tokens, title, body, data }: SendFirebaseMulticastMessagingDto): Promise<{
        success: boolean;
        response?: BatchResponse;
    }>;
    sendTopicNotification({ topic, title, body, data }: SendFirebaseTopicMessagingDto): Promise<{
        success: boolean;
        response?: string;
    }>;
    subscribeToTopic({ topic, tokens }: SubscribeFirebaseTopicDto): Promise<{
        success: boolean;
        response?: MessagingTopicManagementResponse;
    }>;
}
export declare class FirebaseMessagingService implements IFirebaseMessagingService {
    private readonly firebaseRepository;
    private readonly appLogger;
    constructor(firebaseRepository: IFirebaseRepository);
    send({ token, title, body, data }: SendFirebaseMessagingDto): Promise<{
        success: boolean;
        response: string;
    } | {
        success: boolean;
        response?: undefined;
    }>;
    sendMulticast({ tokens, title, body, data }: SendFirebaseMulticastMessagingDto): Promise<{
        success: boolean;
        response: BatchResponse;
    } | {
        success: boolean;
        response?: undefined;
    }>;
    sendTopicNotification({ topic, title, body, data }: SendFirebaseTopicMessagingDto): Promise<{
        success: boolean;
        response: string;
    } | {
        success: boolean;
        response?: undefined;
    }>;
    subscribeToTopic({ topic, tokens }: SubscribeFirebaseTopicDto): Promise<{
        success: boolean;
        response: MessagingTopicManagementResponse;
    } | {
        success: boolean;
        response?: undefined;
    }>;
}

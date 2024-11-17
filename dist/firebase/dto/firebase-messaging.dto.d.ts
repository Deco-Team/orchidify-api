export declare class SendFirebaseMessagingDto {
    token: string;
    title: string;
    body: string;
    data?: {
        [key: string]: string;
    };
}
export declare class SendFirebaseMulticastMessagingDto {
    tokens: string[];
    title: string;
    body: string;
    data?: {
        [key: string]: string;
    };
}
export declare class SendFirebaseTopicMessagingDto {
    topic: string;
    title: string;
    body: string;
    data?: {
        [key: string]: string;
    };
}
export declare class SubscribeFirebaseTopicDto {
    topic: string;
    tokens: string[];
}

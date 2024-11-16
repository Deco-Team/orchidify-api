export declare class SendFirebaseMessagingDto {
    token: string;
    title: string;
    body: string;
    icon?: string;
}
export declare class SendFirebaseMulticastMessagingDto {
    tokens: string[];
    title: string;
    body: string;
    icon?: string;
}
export declare class SendFirebaseTopicMessagingDto {
    topic: string;
    title: string;
    body: string;
    icon?: string;
}

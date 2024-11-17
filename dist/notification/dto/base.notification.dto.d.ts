export declare class BaseNotificationDto {
    _id: string;
    readonly title: string;
    readonly body: string;
    readonly data: {
        [key: string]: string;
    };
    readonly receiverIds: string[];
    createdAt?: Date;
}

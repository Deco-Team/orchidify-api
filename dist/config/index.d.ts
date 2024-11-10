declare const _default: () => {
    mongodbUrl: string;
    mail: {
        SMTP_USERNAME: string;
        SMTP_PASSWORD: string;
        SMTP_HOST: string;
        SMTP_PORT: number;
        SMTP_FROM_EMAIL: string;
        SMTP_SECURE: boolean;
        SMTP_FROM_NAME: string;
    };
    payment: {
        momo: {
            partnerCode: string;
            accessKey: string;
            secretKey: string;
            endpoint: string;
        };
        zalopay: {
            app_id: string;
            key1: string;
            key2: string;
            endpoint: string;
        };
        payos: {
            clientId: string;
            apiKey: string;
            checksumKey: string;
        };
        stripe: {
            apiKey: string;
            webhookSecret: string;
        };
    };
    cloudinary: {
        cloud_name: string;
        api_key: string;
        api_secret: string;
    };
    discord: {
        webhookId: string;
        webhookToken: string;
    };
    redis: {
        host: string;
        port: number;
        username: string;
        password: string;
        db: number;
    };
    NODE_ENV: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRATION: number;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRATION: string;
    WEB_URL: string;
    SERVER_URL: string;
};
export default _default;
export declare const EMAIL_REGEX: RegExp;
export declare const PHONE_REGEX: RegExp;
export declare const URL_REGEX: RegExp;
export declare const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

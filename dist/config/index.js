"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VN_TIMEZONE = exports.URL_REGEX = exports.PHONE_REGEX = exports.EMAIL_REGEX = void 0;
exports.default = () => ({
    mongodbUrl: decodeURIComponent(process.env.MONGODB_CONNECTION_STRING) || 'mongodb://localhost:27017/orchidify',
    mail: {
        SMTP_USERNAME: process.env.SMTP_USERNAME,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: Number(process.env.SMTP_PORT || 465),
        SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
        SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
        SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'SMTP_FROM_NAME'
    },
    payment: {
        momo: {
            partnerCode: process.env.MOMO_PARTNER_CODE,
            accessKey: process.env.MOMO_ACCESS_KEY,
            secretKey: process.env.MOMO_SECRET_KEY,
            endpoint: process.env.MOMO_ENDPOINT
        },
        zalopay: {
            app_id: process.env.ZALOPAY_APP_ID,
            key1: process.env.ZALOPAY_KEY1,
            key2: process.env.ZALOPAY_KEY2,
            endpoint: process.env.ZALOPAY_ENDPOINT
        },
        payos: {
            clientId: process.env.PAYOS_CLIENT_ID,
            apiKey: process.env.PAYOS_API_KEY,
            checksumKey: process.env.PAYOS_CHECKSUM_KEY
        },
        stripe: {
            apiKey: process.env.STRIPE_API_KEY,
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
        }
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    discord: {
        webhookId: process.env.DISCORD_WEBHOOK_ID,
        webhookToken: process.env.DISCORD_WEBHOOK_TOKEN
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT || 6379),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        db: Number(process.env.REDIS_DB || 0)
    },
    NODE_ENV: process.env.NODE_ENV,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'accessSecret',
    JWT_ACCESS_EXPIRATION: Number(process.env.JWT_ACCESS_EXPIRATION) || 864000,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '90d',
    WEB_URL: process.env.WEB_URL || 'https://www.orchidify.tech',
    SERVER_URL: process.env.SERVER_URL || 'https://api.orchidify.tech'
});
exports.EMAIL_REGEX = /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;
exports.PHONE_REGEX = /^(?:$|^[+]?\d{10,12}$)/;
exports.URL_REGEX = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
exports.VN_TIMEZONE = 'Asia/Ho_Chi_Minh';
//# sourceMappingURL=index.js.map
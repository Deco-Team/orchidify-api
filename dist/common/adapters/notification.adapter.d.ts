import { AppLogger } from '@common/services/app-logger.service';
import { MailerService } from '@nestjs-modules/mailer';
export interface MailSendOptions {
    to: string | string[];
    subject: string;
    template: string;
    context?: Record<string, any>;
}
export declare class NotificationAdapter {
    private readonly mailService;
    readonly _appLogger: AppLogger;
    constructor(mailService: MailerService);
    sendMail(options: MailSendOptions): Promise<void>;
}

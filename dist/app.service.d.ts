import { I18nService } from 'nestjs-i18n';
export declare class AppService {
    private readonly i18nService;
    constructor(i18nService: I18nService);
    getHello(): string;
    getI18nText(): string;
}

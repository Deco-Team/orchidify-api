import { ConfigService } from '@nestjs/config';
import { APIEmbedField, WebhookClient } from 'discord.js';
export declare class DiscordService {
    private readonly configService;
    webhookClient: WebhookClient;
    constructor(configService: ConfigService);
    sendMessage({ content, fields }: {
        content?: string;
        fields?: APIEmbedField[];
    }): Promise<void>;
}

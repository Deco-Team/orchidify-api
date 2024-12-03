import { ArgumentsHost, LoggerService } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DiscordService } from '@common/services/discord.service';
export declare class AppExceptionFilter extends BaseExceptionFilter {
    private appLogger;
    private discordService;
    constructor(logger: LoggerService, discordService?: DiscordService);
    catch(exception: any, host: ArgumentsHost): void;
    private _parseError;
}

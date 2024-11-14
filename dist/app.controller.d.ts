import { HealthCheckService, MemoryHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus';
import { AppService } from '@src/app.service';
import { HelperService } from '@common/services/helper.service';
export declare class AppController {
    private readonly appService;
    private readonly healthCheckService;
    private readonly memoryHealthIndicator;
    private readonly mongooseHealthIndicator;
    private readonly helperService;
    constructor(appService: AppService, healthCheckService: HealthCheckService, memoryHealthIndicator: MemoryHealthIndicator, mongooseHealthIndicator: MongooseHealthIndicator, helperService: HelperService);
    getWelcome(): string;
    cert(): Promise<void>;
    healthCheck(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}

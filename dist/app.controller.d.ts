import { HealthCheckService, MemoryHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus';
import { AppService } from '@src/app.service';
export declare class AppController {
    private readonly appService;
    private readonly healthCheckService;
    private readonly memoryHealthIndicator;
    private readonly mongooseHealthIndicator;
    constructor(appService: AppService, healthCheckService: HealthCheckService, memoryHealthIndicator: MemoryHealthIndicator, mongooseHealthIndicator: MongooseHealthIndicator);
    getWelcome(): string;
    healthCheck(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}

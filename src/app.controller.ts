import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus'
import { AppService } from '@src/app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly healthCheckService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly mongooseHealthIndicator: MongooseHealthIndicator
  ) {}

  @Get('welcome')
  getWelcome(): string {
    return this.appService.getI18nText()
  }

  @Get('health')
  @HealthCheck()
  healthCheck() {
    return this.healthCheckService.check([
      () => this.mongooseHealthIndicator.pingCheck('mongodb'),
      () => this.memoryHealthIndicator.checkHeap('memory_heap', 150 * 1024 * 1024)
    ])
  }
}

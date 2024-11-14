import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus'
import { AppService } from '@src/app.service'
// import { HelperService } from '@common/services/helper.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly healthCheckService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly mongooseHealthIndicator: MongooseHealthIndicator,
    // private readonly helperService: HelperService
  ) {}

  @Get('welcome')
  getWelcome(): string {
    return this.appService.getI18nText()
  }

  // @Get('cert')
  // async cert() {
  //   const data = {
  //     learnerName: 'Vo Minh Tien',
  //     courseTitle: 'Khóa học chăm học lan rừng, lan công nghiệp',
  //     dateCompleted: 'July, 23 2021',
  //     certificateCode: 'BS182903344',
  //     instructorName: 'Nguyen Ngoc Anh',
  //     instructorSignature: 'https://res.cloudinary.com/orchidify/image/upload/v1731113221/gdqqxchgrail8mrpkhwa.png'
  //   }

  //   await this.helperService.generatePDF({
  //     data,
  //     templatePath: './templates/learner/certificate.ejs',
  //     certificatePath: 'certs/cert.pdf'
  //   })

  //   console.log('PDF file generated successfully.')
  // }

  @Get('health')
  @HealthCheck()
  healthCheck() {
    return this.healthCheckService.check([
      () => this.mongooseHealthIndicator.pingCheck('mongodb'),
      () => this.memoryHealthIndicator.checkHeap('memory_heap', 150 * 1024 * 1024)
    ])
  }
}

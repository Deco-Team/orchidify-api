import { AppLogger } from '@common/services/app-logger.service'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

export interface MailSendOptions {
  to: string | string[]
  subject: string
  template: string
  context?: Record<string, any>
}

@Injectable()
export class NotificationAdapter {
  public readonly _appLogger = new AppLogger(NotificationAdapter.name)
  constructor(private readonly mailService: MailerService) {}

  async sendMail(options: MailSendOptions) {
    try {
      this._appLogger.log(`[${NotificationAdapter.name}] [success] data= ${JSON.stringify(options)}`)
      await this.mailService.sendMail(options)
    } catch (error) {
      this._appLogger.error(`[${NotificationAdapter.name}] [failed] error = ${JSON.stringify(error.message)}`)
    }
  }
}

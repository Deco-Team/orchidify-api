import { ArgumentsHost, Catch, HttpException, HttpStatus, LoggerService } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import * as _ from 'lodash'
import { AppException } from '@common/exceptions/app.exception'
import { captureException as sentryCaptureException } from '@sentry/node'
import { DiscordService } from '@common/services/discord.service'
import { Errors } from '@common/contracts/error'

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  private appLogger: LoggerService
  private discordService: DiscordService
  constructor(logger: LoggerService, discordService?: DiscordService) {
    super()
    this.appLogger = logger
    if (discordService) this.discordService = discordService
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const { error, httpStatus, message, data } = this._parseError(exception)
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(httpStatus).json({
        error: Errors.INTERNAL_SERVER_ERROR.error,
        message: Errors.INTERNAL_SERVER_ERROR.message,
        data: {
          result: data
        }
      })
    } else {
      response.status(httpStatus).json({
        error,
        message,
        data: {
          result: data
        }
      })
    }

    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR && process.env.NODE_ENV !== 'local') {
      // Sentry
      sentryCaptureException(exception)

      // Discord Bot
      if (this.discordService)
        this.discordService.sendMessage({
          fields: [
            {
              name: `${ctx.getRequest().method} ${ctx.getRequest().url}`,
              value: `${httpStatus} ${JSON.stringify(ctx.getRequest().body)}`
            },
            {
              name: 'Error',
              value: error
            },
            {
              name: 'Message',
              value: message
            },
            {
              name: 'Data',
              value: `${JSON.stringify(data).slice(0, 200)}...`
            },
            {
              name: 'stackTrace',
              value: `${JSON.stringify(exception.stack).slice(0, 200)}...`
            }
          ]
        })
    }
    // if (process.env.NODE_ENV !== 'test') {
    //   this.appLogger.error(message, httpStatus, exception.stack)
    // }
    if (process.env.NODE_ENV !== 'test' && !process.env.COVERAGE) {
      this.appLogger.error(message, httpStatus, exception.stack)
    }
  }
  private _parseError(exception) {
    let error = ''
    let message = ''
    let data = {}
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
    if (exception instanceof AppException) {
      error = exception.error
      httpStatus = exception.httpStatus
      message = exception.message
      data = exception.data
    }
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus()
      const responseData = exception.getResponse()
      if (typeof responseData === 'string') {
        message = responseData
      } else {
        message = 'internal error'
        if (typeof _.get(responseData, 'message') === 'string') {
          message = _.get(responseData, 'message')
        }
        if (typeof _.get(responseData, 'error') === 'string') {
          error = _.get(responseData, 'error')
        }
        data = responseData
      }
    }
    if (message === '') {
      const error = exception
      message = error.message
    }
    return {
      error,
      httpStatus,
      message,
      data
    }
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const _ = require("lodash");
const app_exception_1 = require("./app.exception");
const node_1 = require("@sentry/node");
const discord_service_1 = require("../services/discord.service");
const error_1 = require("../contracts/error");
let AppExceptionFilter = class AppExceptionFilter extends core_1.BaseExceptionFilter {
    constructor(logger, discordService) {
        super();
        this.appLogger = logger;
        this.discordService = discordService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const { error, httpStatus, message, data } = this._parseError(exception);
        if (httpStatus === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            response.status(httpStatus).json({
                error: error_1.Errors.INTERNAL_SERVER_ERROR.error,
                message: error_1.Errors.INTERNAL_SERVER_ERROR.message,
                data: {
                    result: data
                }
            });
        }
        else {
            response.status(httpStatus).json({
                error,
                message,
                data: {
                    result: data
                }
            });
        }
        if (httpStatus === common_1.HttpStatus.INTERNAL_SERVER_ERROR && process.env.NODE_ENV !== 'local') {
            (0, node_1.captureException)(exception);
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
            });
        }
        if (process.env.NODE_ENV !== 'test') {
            this.appLogger.error(message, httpStatus, exception.stack);
        }
    }
    _parseError(exception) {
        let error = '';
        let message = '';
        let data = {};
        let httpStatus = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof app_exception_1.AppException) {
            error = exception.error;
            httpStatus = exception.httpStatus;
            message = exception.message;
            data = exception.data;
        }
        if (exception instanceof common_1.HttpException) {
            httpStatus = exception.getStatus();
            const responseData = exception.getResponse();
            if (typeof responseData === 'string') {
                message = responseData;
            }
            else {
                message = 'internal error';
                if (typeof _.get(responseData, 'message') === 'string') {
                    message = _.get(responseData, 'message');
                }
                if (typeof _.get(responseData, 'error') === 'string') {
                    error = _.get(responseData, 'error');
                }
                data = responseData;
            }
        }
        if (message === '') {
            const error = exception;
            message = error.message;
        }
        return {
            error,
            httpStatus,
            message,
            data
        };
    }
};
exports.AppExceptionFilter = AppExceptionFilter;
exports.AppExceptionFilter = AppExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [Object, discord_service_1.DiscordService])
], AppExceptionFilter);
//# sourceMappingURL=app-exception.filter.js.map
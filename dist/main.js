"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const app_logger_service_1 = require("./common/services/app-logger.service");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const app_exception_filter_1 = require("./common/exceptions/app-exception.filter");
const app_validate_pipe_1 = require("./common/pipes/app-validate.pipe");
const trim_req_body_pipe_1 = require("./common/pipes/trim-req-body.pipe");
const node_1 = require("@sentry/node");
const profiling_node_1 = require("@sentry/profiling-node");
const discord_service_1 = require("./common/services/discord.service");
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true
    });
    if (process.env.NODE_ENV === 'production') {
        (0, node_1.init)({
            dsn: process.env.SENTRY_DSN,
            integrations: [
                ...(0, node_1.autoDiscoverNodePerformanceMonitoringIntegrations)(),
                new node_1.Integrations.Http({ tracing: true }),
                (0, profiling_node_1.nodeProfilingIntegration)()
            ],
            tracesSampleRate: 1.0,
            profilesSampleRate: 1.0
        });
        app.use(node_1.Handlers.requestHandler());
        app.use(node_1.Handlers.tracingHandler());
    }
    const logger = app.get(app_logger_service_1.AppLogger);
    const discordService = app.get(discord_service_1.DiscordService);
    app.useLogger(logger);
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalFilters(new app_exception_filter_1.AppExceptionFilter(logger, discordService));
    const globalPipes = [new trim_req_body_pipe_1.TrimRequestBodyPipe(), new app_validate_pipe_1.AppValidationPipe()];
    app.useGlobalPipes(...globalPipes);
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Orchidify Swagger')
            .setDescription('Orchidify API documentation')
            .setVersion(process.env.npm_package_version || '1.0.0')
            .addBearerAuth()
            .addBearerAuth({
            type: 'http',
            in: 'header',
            scheme: 'bearer'
        }, 'RefreshToken')
            .addSecurity('bearer', {
            type: 'http',
            scheme: 'bearer'
        })
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api-docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true
            }
        });
    }
    if (process.env.NODE_ENV === 'local') {
        mongoose_1.default.set('debug', true);
    }
    const origins = process.env.CORS_VALID_ORIGINS?.split(',').map((origin) => new RegExp(origin)) || [
        /localhost/,
        /ngrok-free/,
        /orchidify.tech/
    ];
    app.use('/transactions/payment/webhook/stripe', express.raw({ type: "*/*" }));
    app.use('/media/upload/base64', (0, express_1.json)({ limit: '60mb' }));
    app.use((0, express_1.json)({ limit: '500kb' }));
    app.enableCors({ origin: origins });
    const port = process.env.PORT || 5000;
    await app.listen(port);
    logger.debug(`🚕 ==>> Orchidify Server is running on port ${port} <<== 🚖`);
}
bootstrap();
//# sourceMappingURL=main.js.map
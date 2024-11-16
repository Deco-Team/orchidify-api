"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const core_1 = require("@nestjs/core");
const mailer_1 = require("@nestjs-modules/mailer");
const ejs_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/ejs.adapter");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const path_1 = require("path");
const config_2 = require("./config");
const common_module_1 = require("./common/common.module");
const learner_module_1 = require("./learner/learner.module");
const auth_module_1 = require("./auth/auth.module");
const instructor_module_1 = require("./instructor/instructor.module");
const staff_module_1 = require("./staff/staff.module");
const garden_manager_module_1 = require("./garden-manager/garden-manager.module");
const garden_module_1 = require("./garden/garden.module");
const recruitment_module_1 = require("./recruitment/recruitment.module");
const media_module_1 = require("./media/media.module");
const class_module_1 = require("./class/class.module");
const terminus_1 = require("@nestjs/terminus");
const garden_timesheet_module_1 = require("./garden-timesheet/garden-timesheet.module");
const course_module_1 = require("./course/course.module");
const class_request_module_1 = require("./class-request/class-request.module");
const setting_module_1 = require("./setting/setting.module");
const transaction_module_1 = require("./transaction/transaction.module");
const queue_module_1 = require("./queue/queue.module");
const attendance_module_1 = require("./attendance/attendance.module");
const payout_request_module_1 = require("./payout-request/payout-request.module");
const feedback_module_1 = require("./feedback/feedback.module");
const firebase_module_1 = require("./firebase/firebase.module");
const certificate_module_1 = require("./certificate/certificate.module");
const notification_module_1 = require("./notification/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_i18n_1.I18nModule.forRootAsync({
                useFactory: () => ({
                    fallbackLanguage: 'en',
                    loaderOptions: {
                        path: (0, path_1.join)(__dirname, '/i18n/'),
                        includeSubfolders: true,
                        watch: true
                    }
                }),
                resolvers: [
                    new nestjs_i18n_1.QueryResolver(['lang', 'l']),
                    new nestjs_i18n_1.HeaderResolver(['Accept-Language']),
                    new nestjs_i18n_1.CookieResolver(),
                    nestjs_i18n_1.AcceptLanguageResolver
                ],
                inject: [config_1.ConfigService]
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [config_2.default],
                cache: true
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('mongodbUrl')
                })
            }),
            mailer_1.MailerModule.forRootAsync({
                useFactory: (configService) => ({
                    transport: {
                        host: configService.get('SMTP_HOST'),
                        port: configService.get('SMTP_PORT'),
                        secure: configService.get('SMTP_SECURE'),
                        auth: {
                            user: configService.get('SMTP_USERNAME'),
                            pass: configService.get('SMTP_PASSWORD')
                        }
                    },
                    defaults: {
                        from: `"${configService.get('SMTP_FROM_NAME')}" <${configService.get('SMTP_FROM_EMAIL')}>`
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, '/templates'),
                        adapter: new ejs_adapter_1.EjsAdapter(),
                        options: {
                            strict: false
                        }
                    }
                }),
                inject: [config_1.ConfigService]
            }),
            core_1.RouterModule.register([
                {
                    path: 'settings',
                    module: setting_module_1.SettingModule
                },
                {
                    path: 'auth',
                    module: auth_module_1.AuthModule
                },
                {
                    path: 'media',
                    module: media_module_1.MediaModule
                },
                {
                    path: 'learners',
                    module: learner_module_1.LearnerModule
                },
                {
                    path: 'instructors',
                    module: instructor_module_1.InstructorModule
                },
                {
                    path: 'staffs',
                    module: staff_module_1.StaffModule
                },
                {
                    path: 'garden-managers',
                    module: garden_manager_module_1.GardenManagerModule
                },
                {
                    path: 'gardens',
                    module: garden_module_1.GardenModule
                },
                {
                    path: 'recruitments',
                    module: recruitment_module_1.RecruitmentModule
                },
                {
                    path: 'classes',
                    module: class_module_1.ClassModule
                },
                {
                    path: 'courses',
                    module: course_module_1.CourseModule
                },
                {
                    path: 'garden-timesheets',
                    module: garden_timesheet_module_1.GardenTimesheetModule
                },
                {
                    path: 'class-requests',
                    module: class_request_module_1.ClassRequestModule
                },
                {
                    path: 'payout-requests',
                    module: payout_request_module_1.PayoutRequestModule
                },
                {
                    path: 'transactions',
                    module: transaction_module_1.TransactionModule
                },
                {
                    path: 'attendances',
                    module: attendance_module_1.AttendanceModule
                },
                {
                    path: 'feedbacks',
                    module: feedback_module_1.FeedbackModule
                },
                {
                    path: 'firebase',
                    module: firebase_module_1.FirebaseModule
                },
                {
                    path: 'certificates',
                    module: certificate_module_1.CertificateModule
                },
                {
                    path: 'notifications',
                    module: notification_module_1.NotificationModule
                }
            ]),
            terminus_1.TerminusModule.forRoot({
                errorLogStyle: 'pretty'
            }),
            common_module_1.CommonModule,
            setting_module_1.SettingModule,
            media_module_1.MediaModule,
            learner_module_1.LearnerModule,
            instructor_module_1.InstructorModule,
            staff_module_1.StaffModule,
            garden_manager_module_1.GardenManagerModule,
            garden_module_1.GardenModule,
            recruitment_module_1.RecruitmentModule,
            class_module_1.ClassModule,
            course_module_1.CourseModule,
            garden_timesheet_module_1.GardenTimesheetModule,
            auth_module_1.AuthModule,
            class_request_module_1.ClassRequestModule,
            payout_request_module_1.PayoutRequestModule,
            transaction_module_1.TransactionModule,
            queue_module_1.QueueModule,
            attendance_module_1.AttendanceModule,
            feedback_module_1.FeedbackModule,
            firebase_module_1.FirebaseModule,
            certificate_module_1.CertificateModule,
            notification_module_1.NotificationModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
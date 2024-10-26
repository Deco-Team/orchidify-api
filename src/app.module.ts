import { Module } from '@nestjs/common'
import { AcceptLanguageResolver, QueryResolver, HeaderResolver, CookieResolver, I18nModule } from 'nestjs-i18n'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { RouterModule } from '@nestjs/core'
import { MailerModule } from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { join } from 'path'
import configuration from '@src/config'
import { CommonModule } from '@common/common.module'
import { LearnerModule } from '@src/learner/learner.module'
import { AuthModule } from '@auth/auth.module'
import { InstructorModule } from '@instructor/instructor.module'
import { StaffModule } from '@staff/staff.module'
import { GardenManagerModule } from '@garden-manager/garden-manager.module'
import { GardenModule } from '@garden/garden.module'
import { RecruitmentModule } from '@recruitment/recruitment.module'
import { MediaModule } from '@media/media.module'
import { ClassModule } from '@src/class/class.module'
import { TerminusModule } from '@nestjs/terminus'
import { GardenTimesheetModule } from '@garden-timesheet/garden-timesheet.module'
import { CourseModule } from '@course/course.module'
import { ClassRequestModule } from '@class-request/class-request.module'
import { SettingModule } from '@setting/setting.module'
import { TransactionModule } from '@transaction/transaction.module'
import { QueueModule } from './queue/queue.module'

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          includeSubfolders: true,
          watch: true
        }
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['Accept-Language']),
        new CookieResolver(),
        AcceptLanguageResolver
      ],
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUrl')
      })
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
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
          dir: join(__dirname, '/templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false
          }
        }
      }),
      inject: [ConfigService]
    }),
    RouterModule.register([
      {
        path: 'settings',
        module: SettingModule
      },
      {
        path: 'auth',
        module: AuthModule
      },
      {
        path: 'media',
        module: MediaModule
      },
      {
        path: 'learners',
        module: LearnerModule
      },
      {
        path: 'instructors',
        module: InstructorModule
      },
      {
        path: 'staffs',
        module: StaffModule
      },
      {
        path: 'garden-managers',
        module: GardenManagerModule
      },
      {
        path: 'gardens',
        module: GardenModule
      },
      {
        path: 'recruitments',
        module: RecruitmentModule
      },
      {
        path: 'classes',
        module: ClassModule
      },
      {
        path: 'courses',
        module: CourseModule
      },
      {
        path: 'garden-timesheets',
        module: GardenTimesheetModule
      },
      {
        path: 'class-requests',
        module: ClassRequestModule
      },
      {
        path: 'transactions',
        module: TransactionModule
      }
    ]),
    TerminusModule.forRoot({
      errorLogStyle: 'pretty'
    }),
    CommonModule,
    SettingModule,
    MediaModule,
    LearnerModule,
    InstructorModule,
    StaffModule,
    GardenManagerModule,
    GardenModule,
    RecruitmentModule,
    ClassModule,
    CourseModule,
    GardenTimesheetModule,
    AuthModule,
    ClassRequestModule,
    TransactionModule,
    QueueModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

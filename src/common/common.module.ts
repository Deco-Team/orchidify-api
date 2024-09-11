import { Global, Module } from '@nestjs/common'
import { AppLogger } from '@common/services/app-logger.service'
import { HelperService } from '@common/services/helper.service'
import { DiscordService } from './services/discord.service'
import { NotificationAdapter } from './adapters/notification.adapter'

@Global()
@Module({
  providers: [AppLogger, HelperService, DiscordService, NotificationAdapter],
  exports: [AppLogger, HelperService, DiscordService, NotificationAdapter]
})
export class CommonModule {}

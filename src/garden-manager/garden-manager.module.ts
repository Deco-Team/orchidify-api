import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GardenManager, GardenManagerSchema } from '@garden-manager/schemas/garden-manager.schema'
import {
  IGardenManagerRepository,
  GardenManagerRepository
} from '@garden-manager/repositories/garden-manager.repository'
import { IGardenManagerService, GardenManagerService } from '@garden-manager/services/garden-manager.service'
import { ManagementGardenManagerController } from './controllers/management.garden-manager.controller'
import { GardenModule } from '@garden/garden.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: GardenManager.name, schema: GardenManagerSchema }]), GardenModule],
  controllers: [ManagementGardenManagerController],
  providers: [
    {
      provide: IGardenManagerService,
      useClass: GardenManagerService
    },
    {
      provide: IGardenManagerRepository,
      useClass: GardenManagerRepository
    }
  ],
  exports: [
    {
      provide: IGardenManagerService,
      useClass: GardenManagerService
    }
  ]
})
export class GardenManagerModule {}

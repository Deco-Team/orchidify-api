import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GardenManager, GardenManagerSchema } from '@garden-manager/schemas/garden-manager.schema'
import {
  IGardenManagerRepository,
  GardenManagerRepository
} from '@garden-manager/repositories/garden-manager.repository'
import { IGardenManagerService, GardenManagerService } from '@garden-manager/services/garden-manager.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: GardenManager.name, schema: GardenManagerSchema }])],
  controllers: [],
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

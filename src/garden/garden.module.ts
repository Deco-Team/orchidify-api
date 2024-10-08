import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Garden, GardenSchema } from '@garden/schemas/garden.schema'
import { IGardenRepository, GardenRepository } from '@garden/repositories/garden.repository'
import { IGardenService, GardenService } from '@garden/services/garden.service'
import { ManagementGardenController } from './controllers/management.garden-manager.controller'
import { GardenManagerModule } from '@garden-manager/garden-manager.module'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Garden.name, schema: GardenSchema }]), GardenManagerModule],
  controllers: [ManagementGardenController],
  providers: [
    {
      provide: IGardenService,
      useClass: GardenService
    },
    {
      provide: IGardenRepository,
      useClass: GardenRepository
    }
  ],
  exports: [
    {
      provide: IGardenService,
      useClass: GardenService
    },
    {
      provide: IGardenRepository,
      useClass: GardenRepository
    }
  ]
})
export class GardenModule {}

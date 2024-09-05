import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Garden, GardenSchema } from '@garden/schemas/garden.schema'
import { IGardenRepository, GardenRepository } from '@garden/repositories/garden.repository'
import { IGardenService, GardenService } from '@garden/services/garden.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Garden.name, schema: GardenSchema }])],
  controllers: [],
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
    }
  ]
})
export class GardenModule {}

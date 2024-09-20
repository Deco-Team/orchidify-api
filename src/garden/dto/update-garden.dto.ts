import { PartialType, PickType } from '@nestjs/swagger'
import { BaseGardenDto } from './base.garden.dto'

export class UpdateGardenDto extends PartialType(PickType(BaseGardenDto, ['description', 'images', 'gardenManagerId'])) {}

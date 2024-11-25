import { PickType } from '@nestjs/swagger'
import { BaseGardenDto } from './base.garden.dto'

export class CreateGardenDto extends PickType(BaseGardenDto, [
  'name',
  'description',
  'address',
  // 'addressLink',
  'images',
  'maxClass',
  'gardenManagerId'
]) {}

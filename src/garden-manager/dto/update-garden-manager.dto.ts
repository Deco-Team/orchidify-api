import { PickType } from '@nestjs/swagger'
import { BaseGardenManagerDto } from './base.garden-manager.dto'

export class UpdateGardenManagerDto extends PickType(BaseGardenManagerDto, ['name']) {}

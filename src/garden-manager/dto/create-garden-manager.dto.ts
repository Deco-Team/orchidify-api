import { PickType } from '@nestjs/swagger'
import { BaseGardenManagerDto } from './base.garden-manager.dto'

export class CreateGardenManagerDto extends PickType(BaseGardenManagerDto, ['name', 'email', 'idCardPhoto']) {}

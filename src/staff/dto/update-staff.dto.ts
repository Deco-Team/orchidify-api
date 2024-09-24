import { PickType } from '@nestjs/swagger'
import { BaseStaffDto } from './base.staff.dto'

export class UpdateStaffDto extends PickType(BaseStaffDto, ['name']) {}

import { PickType } from '@nestjs/swagger'
import { BaseStaffDto } from './base.staff.dto'

export class CreateStaffDto extends PickType(BaseStaffDto, ['name', 'email', 'idCardPhoto']) {}

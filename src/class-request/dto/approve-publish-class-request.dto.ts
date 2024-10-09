import { PickType } from '@nestjs/swagger'
import { BaseClassDto } from '@class/dto/base.class.dto'

export class ApprovePublishClassRequestDto extends PickType(BaseClassDto, ['gardenId']) {}

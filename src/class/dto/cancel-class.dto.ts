import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class CancelClassDto {
  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(500)
  cancelReason: string
}

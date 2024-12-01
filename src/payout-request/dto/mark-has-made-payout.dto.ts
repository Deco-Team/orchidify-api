import { BaseMediaDto } from '@media/dto/base-media.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, MaxLength, ValidateNested } from 'class-validator'

export class MarkHasMadePayoutDto {
  @ApiProperty({ type: String, example: 'Transaction Code' })
  @IsString()
  @MaxLength(500)
  transactionCode: string

  @ApiProperty({ type: BaseMediaDto })
  @Type(() => BaseMediaDto)
  @ValidateNested({ each: true })
  attachment: BaseMediaDto[]
}

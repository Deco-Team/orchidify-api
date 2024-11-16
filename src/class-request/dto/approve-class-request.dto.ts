import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsMongoId, IsOptional } from 'class-validator'

export class ApproveClassRequestDto {
  @ApiPropertyOptional({ type: String, description: 'required if publish class request' })
  @IsOptional()
  @IsMongoId()
  gardenId: string
}

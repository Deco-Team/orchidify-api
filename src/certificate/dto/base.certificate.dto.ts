import { IsMongoId, IsOptional, IsUrl } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { EmailDto } from '@common/dto/email.dto'

export class BaseCertificateDto extends EmailDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  code: string

  @ApiProperty({ type: String })
  @IsUrl()
  url: string

  @ApiProperty({ type: String })
  @IsMongoId()
  ownerId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

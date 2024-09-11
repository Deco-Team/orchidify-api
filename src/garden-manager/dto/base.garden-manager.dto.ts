import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GardenManagerStatus } from '@common/contracts/constant'
import { EmailDto } from '@common/dto/email.dto'

export class BaseGardenManagerDto extends EmailDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string

  @ApiProperty({ type: String })
  @IsUrl()
  idCardPhoto: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsUrl()
  avatar: string

  @ApiProperty({ type: String, enum: GardenManagerStatus })
  @IsEnum(GardenManagerStatus)
  status: GardenManagerStatus

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

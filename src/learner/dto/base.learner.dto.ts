import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LearnerStatus } from '@common/contracts/constant'
import { EmailDto } from '@common/dto/email.dto'
import { PastYear } from '@common/decorators/past-year.decorator'

export class BaseLearnerDto extends EmailDto {
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
  avatar: string

  @ApiProperty({ type: Date })
  @PastYear(10)
  dateOfBirth: Date

  @ApiProperty({ type: String })
  @Matches(/^[+]?\d{10,12}$/)
  phone: string

  @ApiProperty({ type: String, enum: LearnerStatus })
  @IsEnum(LearnerStatus)
  status: LearnerStatus
}

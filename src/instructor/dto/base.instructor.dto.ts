import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { InstructorStatus } from '@common/contracts/constant'
import { EmailDto } from '@common/dto/email.dto'
import { Type } from 'class-transformer'

export class InstructorCertificateDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({ type: String })
  @IsUrl()
  url: string
}

export class PaymentInfoDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  accountNumber: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  accountName: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  metadata: string
}

export class BaseInstructorDto extends EmailDto {
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
  @Matches(/^[+]?\d{10,12}$/)
  phone: string

  @ApiProperty({ type: Date })
  @IsDateString()
  dateOfBirth: Date

  @ApiProperty({ type: InstructorCertificateDto, isArray: true })
  @IsArray()
  @Type(() => InstructorCertificateDto)
  @ValidateNested()
  certificates: InstructorCertificateDto[]

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  bio: string

  @ApiProperty({ type: String })
  @IsUrl()
  idCardPhoto: string

  @ApiProperty({ type: String })
  @IsUrl()
  avatar: string

  @ApiProperty({ type: String, enum: InstructorStatus })
  @IsEnum(InstructorStatus)
  status: InstructorStatus

  @ApiProperty({ type: Number })
  balance: number

  @ApiProperty({ type: PaymentInfoDto })
  paymentInfo: PaymentInfoDto
}

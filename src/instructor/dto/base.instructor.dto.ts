import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { InstructorStatus } from '@common/contracts/constant'
import { EmailDto } from '@common/dto/email.dto'
import { Type } from 'class-transformer'
import { PastYear } from '@common/decorators/past-year.decorator'

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
  @MaxLength(100)
  bankName: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bankShortName: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bankCode: string

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
  @IsOptional()
  @PastYear(18)
  dateOfBirth: Date

  @ApiProperty({ type: InstructorCertificateDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => InstructorCertificateDto)
  @ValidateNested({ each: true })
  certificates: InstructorCertificateDto[]

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  bio: string

  @ApiProperty({ type: String })
  @IsUrl()
  idCardPhoto: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsUrl()
  avatar: string

  @ApiProperty({ type: String, enum: InstructorStatus })
  @IsEnum(InstructorStatus)
  status: InstructorStatus

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  balance: number

  @ApiProperty({ type: PaymentInfoDto })
  @IsOptional()
  @Type(() => PaymentInfoDto)
  @ValidateNested()
  paymentInfo: PaymentInfoDto
}

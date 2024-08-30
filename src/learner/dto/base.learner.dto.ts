import { IsDateString, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LearnerStatus } from '@common/contracts/constant';

export class BaseLearnerDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    _id: string;
  
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;
  
    @ApiProperty({ type: String })
    @IsEmail()
    @MaxLength(50)
    email: string;
  
    @ApiProperty({ type: String })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password: string;
  
    @ApiProperty({ type: String })
    @IsUrl()
    avatar: string
  
    @ApiProperty({ type: Date })
    @IsDateString()
    dateOfBirth: Date
  
    @ApiProperty({ type: String })
    @Matches(/^[+]?\d{10,12}$/)
    phone: string;
  
    @ApiProperty({ type: String, enum: LearnerStatus })
    @IsEnum(LearnerStatus)
    status: LearnerStatus;
  }
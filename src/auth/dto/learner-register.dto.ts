import { ApiProperty } from '@nestjs/swagger'
import { PHONE_REGEX } from '@src/config'
import { IsDateString, IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches, MaxLength } from 'class-validator'

export class LearnerRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({
    type: Date,
    example: '2000-12-12'
  })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date

  @ApiProperty({
    type: String,
    example: '0987654321'
  })
  @IsNotEmpty()
  @Matches(PHONE_REGEX)
  phone: Date
}

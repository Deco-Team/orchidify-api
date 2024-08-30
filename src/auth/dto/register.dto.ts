import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsStrongPassword, Matches, MaxLength } from 'class-validator'

export class RegisterReqDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string
}
